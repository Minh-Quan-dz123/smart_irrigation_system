import {Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';


import { LoginRequest } from 'src/dto/auth/login.dto';
import { RegisterRequest } from 'src/dto/auth/register.dto';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
    ){}

    // 1 login , xác thực và trả về token
    async login(dto: LoginRequest)
    {
        // gọi check password theo email là xong (nếu đúng thì tự khắc trả về user, nếu sai thì trả về null)
        const checkUser = await this.usersService.checkPasswordByEmail(dto.email, dto.password);
        if(!checkUser) throw new UnauthorizedException('Invalid email or password');

        // check hợp lệ rồi thì tạo token
        const payload = {sub: checkUser.id, email: checkUser.email, role: checkUser.role};// payload của token sẽ chứa thông tin của user như id, email, role,... để sau này có thể sử dụng trong quá trình xác thực và phân quyền
        return {
            access_token: await this.jwtService.signAsync(payload),// tạo token bằng cách gọi phương thức sign của JwtService và truyền vào payload đã tạo ở trên. Phương thức sign sẽ trả về một chuỗi token JWT được mã hóa, có thể được sử dụng để xác thực các request đến server.
        };
    }

    // 2 register, tạo user mới
    async register(dto: RegisterRequest){
        const res = await this.usersService.createUser(dto);// check các thứ ở usersService rồi trả về userResponse nếu thành công, nếu thất bại thì throw exception
        if(!res) throw new BadRequestException('Failed to create user');
        return {message: 'User created successfully'};
    }
      

}
