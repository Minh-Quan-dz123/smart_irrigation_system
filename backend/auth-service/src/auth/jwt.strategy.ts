import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';// để tạo ra một chiến lược xác thực mới dựa trên JWT
import {ExtractJwt, Strategy} from 'passport-jwt';
// strategy này sẽ được sử dụng để xác thực các request đến server bằng cách kiểm tra token JWT trong header Authorization của request. Nếu token hợp lệ thì request sẽ được phép tiếp tục, nếu không thì sẽ bị từ chối với lỗi 401 Unauthorized.
// ExtractJwt.fromAuthHeaderAsBearerToken() là một hàm được cung cấp bởi thư viện passport-jwt để trích xuất token JWT từ header Authorization của request. Cụ thể, nó sẽ tìm kiếm header Authorization có định dạng "Bearer <token>" và trả về phần <token> để sử dụng trong quá trình xác thực.

// khai báo lớp JwtStrategy kế thừa từ PassportStrategy để tạo ra một chiến lược xác thực mới dựa trên JWT

// JWT có cấu trúc header.payload,signature
// hearer chứa ví dụ như alg: "RS256", typ: "JWT",...
// payload chứa thông tin của user như sub: "userId", email: "userEmail", role: "userRole",...
// signature là phần được tạo ra bằng cách hash header và payload với secret key, dùng để xác thực token có hợp lệ hay không
// signature = hash(header + payload + secretKey) => server sẽ hash header va payload với secretKey va so sánh với signature trong token, nếu trùng khớp thì token hợp lệ, nếu không thì token không hợp lệ
// secret trong trường hợp này là private key, public key được sử dụng để xác thực token, private key được dùng để tạo ra token, public key được dùng để xác thực token, nếu token được tạo ra bằng private key thì chỉ có public key mới có thể xác thực được token đó, và ngược lại nếu token được tạo ra bằng public key thì chỉ có private key mới có thể xác thực được token đó
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor()
    {
        // cấu hình xác thực JWT bằng cách truyền vào các tùy chọn trong super()
        // super để gọi constructor của lớp cha PassportStrategy và truyền vào các tùy chọn cấu hình cho chiến lược JWT
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,//jwt hết hạn thì từ chối xác thực
            publicKey: process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n'),
            algorithms: ['RS256'],
        })
    }

    // phương thức validate 
    async validate(payload: any)
    {
        return {userId: payload.sub, email: payload.email, role: payload.role}
    }
}