import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from '../entity/book.entity';
import { Author } from '../entity/author.entity';
import { Comment } from '../entity/comment.entity';
import { User } from '../entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Author, Comment, User]),
  ],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
