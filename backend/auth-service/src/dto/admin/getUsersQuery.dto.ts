import { IsOptional, IsNumberString, IsString, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

// ví dụ GET /users?page=1&limit=10&search=quan&status=active

export class GetUsersQuery {

    @Expose()
    @IsOptional()
    @IsNumber()
    page?: number;

    @Expose()
    @IsOptional()
    @IsNumber()
    limit?: number;

    @Expose()
    @IsOptional()
    @IsString()
    search?: string;

}
