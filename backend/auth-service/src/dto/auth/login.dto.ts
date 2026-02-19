import {Expose} from "class-transformer";// Expose để chỉ định rằng trường này sẽ được bao gồm khi chuyển đổi đối tượng thành JSON hoặc ngược lại

import {IsString, IsNotEmpty, IsEmail, IsOptional} from "class-validator";// các decorator để validate dữ liệu đầu vào như @IsEmail để kiểm tra xem trường đó có phải là email hay không, @IsString để kiểm tra xem trường đó có phải là chuỗi hay không

export class LoginRequest{
    @Expose()// chỉ định rằng trường này sẽ được bao gồm khi chuyển đổi đối tượng thành JSON hoặc ngược lại
    @IsEmail({}, { message: "Email must be valid" })// kiểm tra xem trường này có phải là email hay không
    @IsNotEmpty({ message: "Email is required" })// kiểm tra xem trường này có phải là rỗng hay không
    email: string;

    @Expose()
    @IsString({ message: "Password must be a string" })// kiểm tra xem trường này có phải là chuỗi hay không
    @IsNotEmpty({ message: "Password is required" })// kiểm tra xem trường này có phải là rỗng hay không
    password: string;


    @Expose()
    @IsString({ message: "Phone must be a string" })// kiểm tra xem trường này có phải là chuỗi hay không
    @IsOptional()// chỉ định rằng đây là tùy chọn
    phone?: string;
}