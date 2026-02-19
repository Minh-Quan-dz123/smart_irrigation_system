import { Controller} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Get, Body, Req, Delete, Patch} from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt.guard";
import { UpdateUserRequest } from "src/dto/user/updateUserRequest.dto";
/*
1 request đến như sau
POST /users/10?role=admin&page=2
Headers:
Authorization: Bearer xxx
Content-Type: application/json

Body:
{
  "username": "quan",
  "email": "quan@gmail.com"
}

| Decorator    | Lấy gì          |ví dụ             |
| ------------ | --------------- | -----------------|
| `@Req()`     | toàn bộ request | 
| `@Res()`     | response        | 
| `@Body()`    | body JSON       |{"username": "quan", "email": "quan@gmail.com"}
| `@Param()`   | param URL       | /users/10 -> @Param('id') id = 10
| `@Query()`   | query string    | ?page=2 -> @Query('page') page = 2
| `@Headers()` | header          | Authorization: Bearer xxx -> @Headers('Authorization') auth
| `@Ip()`      | IP client       |  @Ip() ip -> 127.0.0.1
| `@Session()` | session         |

*/
@Controller('users')
export class UserController{
    constructor(private usersService: UsersService){}

    // 1. lấy thông tin cá nhân của user
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: any){// req.user sẽ được thêm vào sau khi xác thực token thành công, chứa thông tin user như email, role, v.v.
        return this.usersService.getUserById(req.user.userId);
    }

    // 2. cập nhật thông tin cá nhân của user
    @Patch('profile')
    @UseGuards(JwtAuthGuard)
    updateProfile(@Req() req: any, @Body() dto: UpdateUserRequest){
        return this.usersService.updateUser(req.user.userId, dto); 
    }

    // 3. xóa tài khoản user (có thể từ user hoặc admin)
    @Delete('profile')
    @UseGuards(JwtAuthGuard)
    deleteProfile(@Req() req: any){
        return this.usersService.deleteUserById(req.user.userId);
    }

}