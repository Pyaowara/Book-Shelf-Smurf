import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { ForumCommentModule } from './forum-comment/forum-comment.module';
import { CommentsModule } from './comments/comments.module';
import { BookShopService } from './book-shop/book-shop.service';
import { BookShopController } from './book-shop/book-shop.controller';
import { BookShopModule } from './book-shop/book-shop.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      database: 'book_v2',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
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
    ForumCommentModule,
    CommentsModule,
    BookShopModule,
  ],
})
export class AppModule {}
