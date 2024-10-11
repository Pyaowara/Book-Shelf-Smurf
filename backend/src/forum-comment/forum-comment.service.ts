import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumComment } from '../entity/forum_comment.entity';
import { Forum } from '../entity/forum.entity';
import { User } from '../entity/user.entity';

@Injectable()
export class ForumCommentService {
  constructor(

    @InjectRepository(ForumComment)
    private readonly forumCommentRepository: Repository<ForumComment>,

    @InjectRepository(Forum)
    private readonly forumRepository: Repository<Forum>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ) {}

  async findTitle(forumId: number): Promise<{ title: string }> {
    const forum = await this.forumRepository.findOne({ where: { forum_id: forumId } });

    if (!forum) {
        throw new NotFoundException('Forum not found');
    }
    return { title: forum.forum_title };
}

async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.forumCommentRepository.findOne({
      where: { forum_comment_id: commentId },
      relations: ['user']
    });
    
    if (!comment)
      throw new NotFoundException('Comment not found');
    if (comment.user.user_id !== Number(userId)){
      throw new BadRequestException('Unauthorized to delete this comment');
    }
    await this.forumCommentRepository.delete({ forum_comment_id: commentId });
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

  async addForum(userId: number, forumTitle: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { user_id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const forum = this.forumRepository.create({
        user,
        forum_title: forumTitle,
      });
      await this.forumRepository.save(forum);
    } catch (error) {
      console.error('Error saving forum post:', error);
      throw new InternalServerErrorException('Error adding forum post');
    }
  }

  async getAllForum(): Promise<Forum[]> {
    return await this.forumRepository.createQueryBuilder('forum')
      .leftJoinAndSelect('forum.user', 'user')
      .orderBy('forum.create_time_stamp', 'DESC')
      .getMany();
  }

  async deleteForum(forumId: number, userId: number): Promise<void> {
    const comment = await this.forumRepository.findOne({
      where: { forum_id: forumId },
      relations: ['user']
    });
    
    if (!comment)
      throw new NotFoundException('Comment not found');
    if (comment.user.user_id !== Number(userId)){
      throw new BadRequestException('Unauthorized to delete this comment');
    }
    await this.forumRepository.delete({ forum_id: forumId });
  }
}
