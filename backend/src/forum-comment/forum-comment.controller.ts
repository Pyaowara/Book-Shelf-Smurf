import { Get, Body, Controller, Post, NotFoundException, BadRequestException, InternalServerErrorException, Param, Delete, Query } from '@nestjs/common';
import { ForumCommentService } from './forum-comment.service';
import { ForumComment } from '../entity/forum_comment.entity';

@Controller('forum-comments')
export class ForumCommentController {
  constructor(private readonly forumCommentService: ForumCommentService) {}

  @Get('/:id')
async findTitle(@Param('id') id: string): Promise<{ title: string }> {
    return this.forumCommentService.findTitle(Number(id)); // Ensure return type matches
}

  @Get('/findcomment/:id')
  async findAll(@Param('id') id: string): Promise<ForumComment[]> {
    return this.forumCommentService.findCommentsByForumId(Number(id));
  }

  @Post('/add')
  async addForumComment(
    @Body('forum_id') forumId: number,
    @Body('comment_detail') commentDetail: string,
    @Body('user_id') userId: number,
  ): Promise<{ message: string }> {
    if (!forumId || !commentDetail || !userId) {
      throw new BadRequestException('All fields (forum_id, comment_detail, user_id) are required');
    }
    try {
      await this.forumCommentService.addForumComment(forumId, commentDetail, userId);
      return { message: 'Forum comment added successfully!' };
    } catch (error) {
      throw new InternalServerErrorException('Error adding forum comment');
    }
  }

  @Post('/reply')
  async addForumReply(
    @Body('forum_id') forumId: number,
    @Body('comment_detail') commentDetail: string,
    @Body('user_id') userId: number,
    @Body('forum_comment_reply_id') replyId: number,
  ): Promise<{ message: string }> {
    if (!forumId || !commentDetail || !userId || !replyId) {
      throw new BadRequestException('All fields (forum_id, comment_detail, user_id, forum_comment_reply_id) are required');
    }

    try {
      await this.forumCommentService.addForumReply(forumId, commentDetail, userId, replyId);
      return { message: 'Reply added successfully!' };
    } catch (error) {
      throw new InternalServerErrorException('Error adding reply');
    }
  }

  @Delete(':commentId/delete')
  async deleteComment(
    @Param('commentId') commentId: number,
    @Body('user_id') userId: number
  ): Promise<{ message: string }> {
    if (!commentId || !userId) {
      throw new BadRequestException('Comment ID and User ID are required');
    }
    try {
      await this.forumCommentService.deleteComment(commentId, userId);
      return { message: 'Comment deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Comment not found');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Unauthorized to delete this comment');
      } else {
        throw new InternalServerErrorException('Error deleting comment');
      }
    }
  }

}
