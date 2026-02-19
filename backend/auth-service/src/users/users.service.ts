// users.service để thực hiện các thao tác sau
// 1. lấy thông tin user theo email, phone, id,... để dùng trong auth service
// 2. cập nhật thông tin user
// 3. xóa user
// 4. thêm user


import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {SupabaseService} from '../supabase/supabase.service';
import { UserResponse } from 'src/dto/user/userResponse.dto';
import { UpdateUserRequest } from 'src/dto/user/updateUserRequest.dto';
import { AddUser } from 'src/dto/user/addUser.dto';

import bcrypt from 'bcrypt';// thư viện để hash password, giúp bảo mật hơn khi lưu trữ password trong database

import { UnauthorizedException, NotFoundException, ConflictException} from '@nestjs/common';

@Injectable()
export class UsersService{

    // thuộc tính -- ko co
    // contructor
    constructor(private supabaseService: SupabaseService) {}// inject SupabaseService thay vì phải khởi tạo client trong service này, 
    // giúp code gọn hơn và dễ quản lý hơn

    // phương thức
    // 1.1 lấy thông tin user từ email
    async getUserByEmail(email: string){
        // bắt buộc phải biết role để xem admin hay user là người lấy
        /* .eq() = equal → dùng để lọc các dòng mà giá trị của cột = giá trị chỉ định.
        Cú pháp    .eq('column_name', value)
        - bên cạnh đó phải trả về kết quả object {data, error} vì supabase trả về như vậy*/
        const {data, error} = await this.supabaseService.getClient().from('users').select('*').eq('email', email).maybeSingle();

        if (error) throw new InternalServerErrorException(error.message);

        if (!data) throw new NotFoundException('User not found');
    
        return UserResponse.from(data);
    }
    

    // 1.2 lấy thông tin user theo id
    async getUserById(id: string)
    {
        const {data, error} = await this.supabaseService.getClient().from('users').select('*').eq('id', id).maybeSingle();
        if (error) throw new InternalServerErrorException(error.message);

        if (!data) throw new NotFoundException('User not found');
        return UserResponse.from(data);
    }

    // 1.3 lấy thông tin user theo phone
    async getUserByPhone(phone: string)
    {
        const {data, error} = await this.supabaseService.getClient().from('users').select('*').eq('phone', phone).maybeSingle();
        if (error) throw new InternalServerErrorException(error.message);

        if (!data) throw new NotFoundException('User not found');
        return UserResponse.from(data);
    }
  

    // 2. cập nhật thông tin user
    async updateUser(id: string, dto: UpdateUserRequest)
    {
        // 1 check xem id này tồn tại ko
        const {data: existingUser, error: existingUserError} = await this.supabaseService.getClient().from('users').select('*').eq('id', id).eq('role',"user").maybeSingle();
        if (existingUserError) throw new InternalServerErrorException(existingUserError.message);

        if (!existingUser) throw new NotFoundException('User not found');
        const updateUser: any = {};

        // 2 check các trường cập nhật có hợp lệ hay không (nếu cập nhật email thì check email đã tồn tại chưa, tương tự với phone,...)
        if(dto.new_email !== undefined)
        {
            const {data: emailUser, error: emailError} = await this.supabaseService.getClient().from('users').select('id').eq('email', dto.new_email).eq('role','user').maybeSingle();
            if(emailUser && emailUser.id !== id) throw new ConflictException('Email already exists');
            // nếu chưa tồn tại cho user nào thì cập nhật cho user này
            updateUser.email = dto.new_email;
        }
        if(dto.new_username !== undefined)
        {
            updateUser.username = dto.new_username;
        }
        if(dto.new_phone !== undefined)
        {
            const {data: phoneUser, error: phoneError} = await this.supabaseService.getClient().from('users').select('id').eq('phone', dto.new_phone).eq('role','user').maybeSingle();
            if(phoneUser && phoneUser.id !== id) throw new ConflictException('Phone already exists');
            updateUser.phone = dto.new_phone;
        }
        
        
        if(dto.new_password !== undefined && dto.old_password !== undefined)
        {
            if(!dto.old_password || !dto.new_password) throw new BadRequestException('Old password and new password are required');

            const isMatch = await bcrypt.compare(dto.old_password, existingUser.password);
            if(!isMatch) throw new UnauthorizedException('Old password is incorrect');

            // nếu oke hết thì cập nhật
            const hashedPassword = await bcrypt.hash(dto.new_password, 10);
            updateUser.password = hashedPassword;
        }
        
        if(Object.keys(updateUser).length === 0) throw new BadRequestException('No data to update');


        // 3 sau đó cập nhật lại user trong database
        const {data, error} = await this.supabaseService.getClient().from('users').update(updateUser).eq('id', id).eq('role','user').maybeSingle();
        if (error) throw new InternalServerErrorException(error.message);
        if (!data) throw new NotFoundException('User not found');
        return UserResponse.from(data);
    }

    // 3. xóa user theo id, email
    async deleteUserById(id: string){
        const {data, error} = await this.supabaseService.getClient().from('users').delete().eq('id', id).eq('role','user').maybeSingle();
        if (error) throw new InternalServerErrorException(error.message);
        if (!data) throw new NotFoundException('User not found');
        return {message: 'User deleted successfully'};
    }

    async deleteUserByEmail(email: string){
        const {data, error} = await this.supabaseService.getClient().from('users').delete().eq('email', email).eq('role','user').maybeSingle();
        if (error) throw new InternalServerErrorException(error.message);
        if (!data) throw new NotFoundException('User not found');
        return {message: 'User deleted successfully'};
    }

    // 4. thêm user theo 
    async createUser(dto: AddUser){
        // 1 check email, phone đã tồn tại chưa
        if(dto.email)
        {
            const {data: emailUser, error: emailError} = await this.supabaseService.getClient().from('users').select('id').eq('email', dto.email).eq('role','user').maybeSingle();
            if(emailUser && !emailError) throw new ConflictException('Email already exists');
        }
        if(dto.phone)
        {
            const {data: phoneUser, error: phoneError} = await this.supabaseService.getClient().from('users').select('id').eq('phone', dto.phone).eq('role','user').maybeSingle();
            if(phoneUser && !phoneError) throw new ConflictException('Phone already exists');
        }
        

        // xử lý hash password
        if(dto.password)
        {
            // hash password với salt rounds là 10 (mức độ bảo mật cao, nhưng vẫn đảm bảo hiệu suất)
            const hashedPassword = await bcrypt.hash(dto.password, 10);
            dto.password = hashedPassword;// gán lại cho tiết kiệm biến
        }
        else throw new BadRequestException('Password is required');

        // 2 nếu email và phone oke rồi thì tạo user mới
        const {data, error} = await this.supabaseService.getClient().from('users').insert({
            email: dto.email,
            username: dto.username,
            phone: dto.phone,
            remaining_device_quota: dto.remaining_device_quota ?? 10, // nếu không cung cấp thì mặc định là 10
            password: dto.password,
            role: "user", // role mặc định là user, không cho phép tạo admin qua API này
        }).maybeSingle();// single() để trả về đối tượng thay vì mảng
        if(error) throw new InternalServerErrorException('Failed to create user');
        return UserResponse.from(data);

    }

    // 5 check password khi đăng nhập
    async checkPasswordByEmail(email: string, password_input: string){
        // tìm user theo email để lấy password
        const {data, error} = await this.supabaseService.getClient().from('users').select('*').eq('email', email).eq('role','user').maybeSingle();
        if (error) throw new InternalServerErrorException(error.message);

        if (!data) throw new NotFoundException('User not found');

        // tìm đc thì so sánh tên
        const isPasswordValid = await bcrypt.compare(password_input, data.password);  
        if(!isPasswordValid) throw new UnauthorizedException('Invalid password');

        return UserResponse.from(data);
    }


   
}