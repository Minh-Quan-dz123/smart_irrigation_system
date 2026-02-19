import { Controller} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Get,Body, Req,Patch, Param } from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt.guard";
import { UpdateUserByAdmin } from "src/dto/admin/updateUsersByAdmin.dto";
import { Query } from "@nestjs/common";
import { GetUsersQuery} from "src/dto/admin/getUsersQuery.dto";

@Controller('admin/users')
export class AdminController{
    constructor(private adminService: AdminService){}

    // 1. cập nhật thông tin cá nhân của user
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    updateProfile(@Req() req: any, @Param('id') id: number, @Body() dto: UpdateUserByAdmin){
        return this.adminService.updateUser(req.user.role, id, dto); 
    }

    // 2. lấy danh sách user theo query (email, phone, username) và phân trang
    @Get()
    @UseGuards(JwtAuthGuard)
    getUsersByQuery(@Req() req: any, @Query() query: GetUsersQuery){
        return this.adminService.getUsersByQuery(req.user.role, query);
    }

}