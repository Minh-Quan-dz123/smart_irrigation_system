import { Module } from '@nestjs/common';// bắt buộc để tổ chức module
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';


@Module({
    imports: [SupabaseModule],
    providers: [AdminService],
    exports: [AdminService], 
    controllers: [AdminController],
})
export class AdminModule{};