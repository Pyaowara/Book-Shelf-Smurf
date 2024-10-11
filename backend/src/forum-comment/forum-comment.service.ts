import { Injectable, InternalServerErrorException,NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumComment } from '../entity/forum_comment.entity';
import { Forum } from '../entity/forum.entity';

@Injectable()
export class ForumCommentService {
  constructor(

    @InjectRepository(ForumComment)
    private readonly forumCommentRepository: Repository<ForumComment>,

    @InjectRepository(Forum)
    private readonly forumRepository: Repository<Forum>,

  ) {}

  async findTitle(forumId: number): Promise<{ title: string }> {
    const forum = await this.forumRepository.findOne({ where: { forum_id: forumId } });

    if (!forum) {
        throw new NotFoundException('Forum not found');
    }
    return { title: forum.forum_title }; // Return an object
}

  async addForumComment(forumId: number, commentDetail: string, userId: number) {
    const forumComment = this.forumCommentRepository.create({
      forum_id: forumId,
      user_id: userId,
      comment: commentDetail,
      forum_comment_reply_id: null,
      upvote: 0,
      downvote: 0,
      delete_status: 'Normal',
      time_stamp: new Date(),
    });
  
    try {
      await this.forumCommentRepository.save(forumComment);
    } catch (error) {
      console.error('Error details:', error);
      throw new InternalServerErrorException('Error adding forum comment');
    }
  }
  

  async addForumReply(forumId: number, commentDetail: string, userId: number, replyId: number) {
    const forumReply = this.forumCommentRepository.create({
      forum_id: forumId,
      user_id: userId,
      comment: commentDetail,
      forum_comment_reply_id: replyId,
      upvote: 0,
      downvote: 0,
      delete_status: 'Normal',
      time_stamp: new Date(),
    });

    try {
      await this.forumCommentRepository.save(forumReply);
    } catch (error) {
      throw new InternalServerErrorException('Error adding reply');
    }
  }

  async findCommentsByForumId(forumId: number): Promise<ForumComment[]> {
    return this.forumCommentRepository.createQueryBuilder('forum_comment')
      .leftJoinAndSelect('forum_comment.user', 'user')
      .where('forum_comment.forum_id = :forumId', { forumId })
      .orderBy('forum_comment.time_stamp', 'ASC')
      .getMany();
  }
}
