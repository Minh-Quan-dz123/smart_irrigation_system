import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // tạo app
  // thêm các middleware, global pipe, global guard
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // chỉ cho phép các thuộc tính được định nghĩa trong DTO, nếu client gửi thêm thuộc tính không có trong DTO sẽ bị loại bỏ
      forbidNonWhitelisted: true, // thêm lỗi khi client gửi thêm thuộc tính không có trong DTO, giúp phát hiện và xử lý các request không hợp lệ
      transform: true, // tự động chuyển đổi payload thành các instance của class DTO, giúp dễ dàng sử dụng và validate dữ liệu trong controller
    }),);
  
    await app.listen(process.env.PORT ?? 3000);// mở server trên cổng 3000 hoặc cổng được chỉ định trong biến môi trường PORT
}
bootstrap();
