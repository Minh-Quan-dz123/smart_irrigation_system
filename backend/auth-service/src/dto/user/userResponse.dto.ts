import {Expose} from "class-transformer";// Expose để chỉ định rằng trường này sẽ được bao gồm khi chuyển đổi đối tượng thành JSON hoặc ngược lại


// dto dùng cho output từ server ra client
export class UserResponse{
    @Expose()// chỉ định rằng trường này sẽ được bao gồm khi chuyển đổi đối tượng thành JSON hoặc ngược lại
    id: number;

    @Expose()
    email: string;

    @Expose()
    username: string;

    @Expose()
    phone: string;

    @Expose()
    remaining_device_quota: number;

    @Expose()
    created_at?: Date;

    @Expose()
    role: string;

    static from(data: any): UserResponse{
        const userRes = new UserResponse();
        userRes.id = data.id;
        userRes.email = data.email;
        userRes.username = data.username;
        userRes.phone = data.phone;
        userRes.remaining_device_quota = data.remaining_device_quota;
        userRes.created_at = data.created_at;
        userRes.role = data.role;
        return userRes;
    }

}