import { Module } from '@nestjs/common';// bắt buộc để tổ chức module
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';


@Module({
    imports: [SupabaseModule],
    providers: [UsersService],
    exports: [UsersService], 
    controllers: [UserController],
})
export class UsersModule{};