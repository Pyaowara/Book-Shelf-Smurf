import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumCommentController } from './forum-comment.controller';
import { ForumCommentService } from './forum-comment.service';
import { ForumComment } from '../entity/forum_comment.entity';
import { Forum } from 'src/entity/forum.entity';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ForumComment, Forum, User]),
  ],
  controllers: [ForumCommentController],
  providers: [ForumCommentService],
  exports: [ForumCommentService],
})
export class ForumCommentModule {}
