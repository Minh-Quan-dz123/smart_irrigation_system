import {Module} from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [UsersModule,
        // thêm jwt
        JwtModule.register({
            privateKey: process.env.JWT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            publicKey: process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n'),
            signOptions: 
            { 
                expiresIn: '7d' ,
                algorithm: 'RS256'
            },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService, JwtModule],
    controllers: [AuthController],
})
export class AuthModule{}