import {Controller, Post, Body} from '@nestjs/common';
// req để lấy thông tin user sau khi xác thực token, body để lấy thông tin đăng nhập từ client gửi lên
// useGuards để bảo vệ các route cần xác thực bằng jwt, chỉ cần dùng @UseGuards(JwtAuthGuard) là được
import { AuthService } from './auth.service';
import { LoginRequest } from 'src/dto/auth/login.dto';
import { RegisterRequest } from 'src/dto/auth/register.dto';

@Controller('auth')// đường dẫn để truy cập vào controller này, vd: http://localhost:3000/auth/login
export class AuthController{
    constructor(private authService: AuthService){}// inject AuthService để sử dụng các phương thức trong service này

    @Post('login')
    login(@Body() dto: LoginRequest){
        return this.authService.login(dto);// gọi xuống layer dưới
    }
    
    @Post('register')
    register(@Body() dto: RegisterRequest){
        return this.authService.register(dto);
    }
}