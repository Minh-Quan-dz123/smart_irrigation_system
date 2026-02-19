import { Module } from '@nestjs/common';// bắt buộc để tổ chức module

// import các module khác
import {AuthModule} from './auth/auth.module';

@Module({ // <=> include trong C
  // 1 imports để import các module khác vào đây như include trong C
  imports: [
    // các module khác
    AuthModule,
  ],
  // 2 exports: [], // giống extern trong C để service khác dùng được module này
  // 3 controllers: [], // để khai báo các controller trong module này
  // 4 providers: [], // để khai báo các service trong module này <=> functin trong c
  // thêm các module khác vào đây nếu có
})
export class AppModule {}
