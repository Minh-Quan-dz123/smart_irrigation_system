import { UpdateUserByAdmin } from "src/dto/admin/updateUsersByAdmin.dto";
import {BadRequestException, Injectable, InternalServerErrorException, ForbiddenException} from '@nestjs/common';
import {SupabaseService} from '../supabase/supabase.service';
import { UserResponse } from 'src/dto/user/userResponse.dto';
import { GetUsersQuery } from 'src/dto/admin/getUsersQuery.dto';

import bcrypt from 'bcrypt';// thư viện để hash password, giúp bảo mật hơn khi lưu trữ password trong database

import { UnauthorizedException, NotFoundException, ConflictException} from '@nestjs/common';

@Injectable()
export class AdminService{

  
    constructor(private supabaseService: SupabaseService) {}// inject SupabaseService thay vì phải khởi tạo client trong service này, 
    // 1. cập nhật thông tin user
    async updateUser(role: string, id: number, dto: UpdateUserByAdmin)
    {
        // check role xem có phải admin ko
        if(role !== "admin") throw new ForbiddenException('Admin only');
        // 1 check xem id này tồn tại ko
        const {data: existingUser, error: existingUserError} = await this.supabaseService.getClient().from('users').select('*').eq('id', id).maybeSingle();
        if(existingUserError || !existingUser) throw new NotFoundException('User not found');

        const updateUser: any = {};

        // 2 check các trường cập nhật có hợp lệ hay không (nếu cập nhật email thì check email đã tồn tại chưa, tương tự với phone,...)
        if(dto.new_email !== undefined)
        {
            const {data: emailUser, error: emailError} = await this.supabaseService.getClient().from('users').select('id').eq('email', dto.new_email).maybeSingle();
            if(emailUser || emailError) throw new ConflictException('Email already exists');
            // nếu chưa tồn tại cho user nào thì cập nhật cho user này
            updateUser.email = dto.new_email;
        }
        if(dto.new_username !== undefined)
        {
            updateUser.username = dto.new_username;
        }
        if(dto.new_phone !== undefined)
        {
            const {data: phoneUser, error: phoneError} = await this.supabaseService.getClient().from('users').select('id').eq('phone', dto.new_phone).maybeSingle();
            if(phoneUser && phoneError) throw new ConflictException('Phone already exists');
            updateUser.phone = dto.new_phone;
        }
        
        
        if(dto.new_password !== undefined && dto.old_password !== undefined)
        {
            const isMatch = await bcrypt.compare(dto.old_password, existingUser.password);
            if(!isMatch) throw new UnauthorizedException('Old password is incorrect');

            // nếu oke hết thì cập nhật
            const hashedPassword = await bcrypt.hash(dto.new_password, 10);
            updateUser.password = hashedPassword;
        }
        
        if(Object.keys(updateUser).length === 0) throw new BadRequestException('No data to update');

        // cập nhật remaining_device_quota
        if(dto.new_remaining_device_quota !== undefined)
        {
            if(dto.new_remaining_device_quota < 0) throw new  BadRequestException('Remaining device quota must be greater than or equal to 0')
        }

        // 3 sau đó cập nhật lại user trong database
        const {data, error} = await this.supabaseService.getClient().from('users').update(updateUser).eq('id', id).maybeSingle();
        if(error) throw new InternalServerErrorException('Failed to update user')
        return UserResponse.from(data);
    }


   

    // 6 lấy danh sách user theo query (email, phone, username) và phân trang
    async getUsersByQuery(role: string, query: GetUsersQuery){
        if(role !== "admin") throw new ForbiddenException('Admin only');
        let listUsers = this.supabaseService.getClient().from('users').select('id, email, username, phone,remaining_device_quota, created_at , update_at').order('id', {ascending: false})// sắp xếp giảm dần theo id

        // search theo email
        if(query.search){
            listUsers = listUsers.ilike('email',`%${query.search}%`);
        }

        // filter theo role // trừ admin ra
        listUsers = listUsers.eq('role', "user");

        // pagination
        if(query.limit && query.limit>0)
        {
            if(query.page && query.page > 0)
            {
                const start = (query.page)*(query.limit);
                // ví dụ (0,9) => start = 0, end = 8

                listUsers = listUsers.range(start, start + query.limit - 1);
            }
        }
        const {data, error} = await listUsers;
        if(error) throw new BadRequestException(error.message);
        return data;
    
    }
}