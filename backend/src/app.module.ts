import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from './book/book.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      database: 'bookchiphaiv2',
      host: process.env.DB_HOST,
      username: process.env.DB_ROOT,
      password: process.env.DB_PASS,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      //ห้ามเปลี่ยนเป็น True นะไอสัส
      //ห้ามเปลี่ยนเป็น True นะไอสัส
      //ห้ามเปลี่ยนเป็น True นะไอสัส
      synchronize: false, //ห้ามเปลี่ยนเป็น True
      //ห้ามเปลี่ยนเป็น True นะไอสัส
      //ห้ามเปลี่ยนเป็น True นะไอสัส
      //ห้ามเปลี่ยนเป็น True นะไอสัส
    }),
    BookModule,
    UserModule,
  ],
})
export class AppModule {}
