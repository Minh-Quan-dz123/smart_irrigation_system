import {Injectable} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){}
// để bảo vệ các route cần xác thực bằng jwt, chỉ cần dùng @UseGuards(JwtAuthGuard) là được
// lớp AuthGuard('jwt') sẽ tự động sử dụng chiến lược JwtStrategy để xác thực token trong request. Nếu token hợp lệ thì request 
// sẽ được chuyển tiếp đến controller, nếu không thì sẽ trả về lỗi 401 Unauthorized.
// => thay vì viết 
/*
@Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user}

    thì tao viết

    @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user
    */