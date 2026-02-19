import {Expose} from "class-transformer";// Expose để chỉ định rằng trường này sẽ được bao gồm khi chuyển đổi đối tượng thành JSON hoặc ngược lại
import {IsString, IsNotEmpty, IsEmail, IsOptional, IsNumber, ValidateIf, Matches, MinLength} from "class-validator";// các decorator để validate dữ liệu đầu vào như @IsEmail để kiểm tra xem trường đó có phải là email hay không, @IsString để kiểm tra xem trường đó có phải là chuỗi hay không, @IsOptional để chỉ định rằng trường này là tùy chọn, @IsNumber để kiểm tra xem trường đó có phải là số hay không

// dto dùng cho input từ server ra client
export class UpdateUserRequest{

    @Expose()
    @IsEmail({}, { message: "Email must be a valid email address" })
    @IsOptional()
    new_email?: string;

    @Expose()
    @IsString({ message: "Username must be a string" })
    @IsOptional()
    new_username?: string;

    @Expose()
    @IsOptional()
    @IsString({ message: "Phone must be a string" })// kiểm tra xem trường này có phải là chuỗi hay không
    //phải có từ 9-20 ký tự, là sô
    @Matches(/^[0-9]{9,20}$/, {message: 'Phone number must contain only numbers'})
    @IsNotEmpty({ message: "Phone is required" })
    new_phone?: string;

    // nếu có old thì phải có new
    @Expose()
    @IsString({ message: "Old password must be a string" })
    @IsOptional()
    old_password?: string;

    @Expose()
    @IsOptional()
    @IsString({ message: "Username must be a string" })// kiểm tra xem trường này có phải là chuỗi hay không
    @IsNotEmpty({ message: "Username is required" })// kiểm tra xem trường này có phải là rỗng hay không
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,200}$/, {message: 'Password must be at least 6 characters long and contain both letters and numbers'})    
    new_password?: string;



}