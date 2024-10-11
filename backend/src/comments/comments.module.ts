import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entity/book.entity';
import { Comment } from '../entity/comment.entity';
import { User } from '../entity/user.entity';
import { Voting } from 'src/entity/voting.entity';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [
    TypeOrmModule.forFeature([Book, Comment, User, Voting]),
  ],
})
export class CommentsModule {}
