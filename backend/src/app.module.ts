import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { ForumCommentModule } from './forum-comment/forum-comment.module';
import { CommentsModule } from './comments/comments.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Module({
  imports: [BrowserAnimationsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      database: 'book_v2',
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
    ForumCommentModule,
    CommentsModule,
  ],
})
export class AppModule {}
