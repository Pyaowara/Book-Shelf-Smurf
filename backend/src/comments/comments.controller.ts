import { Controller, Get, Param, Query, Post, BadRequestException, NotFoundException, InternalServerErrorException, Delete, Body, Patch, ParseIntPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from '../entity/comment.entity';



@Controller('comments')
export class CommentsController {
    constructor(private readonly commentService: CommentsService,){}
    
    @Post('/comments/add')
    async addComment(
        @Body('book_id') bookId: number,
        @Body('comment_detail') commentDetail: string,
        @Body('user_id') userId: number,
        @Body('score') score: number,
        @Body('spoiler') spoiler: boolean
    ): Promise<{ message: string }> {
        if (!bookId || !commentDetail || !userId || !score) {
        throw new BadRequestException('All fields (book_id, comment_detail, user_id, score) are required');
        }

        if (score < 1 || score > 5) {
        throw new BadRequestException('Score must be between 1 and 5');
        }

        try {
        await this.commentService.addComment(bookId, commentDetail, userId, score, spoiler);
        return { message: 'Comment added successfully!' };
        } catch (error) {
        throw new InternalServerErrorException('Error adding comment');
        }
    }

    @Get(':id/comments')
    async findCommentsByBookId(@Param('id') id: string): Promise<Comment[]> {
        return this.commentService.findCommentsByBookId(Number(id));
    }

    @Post('/comments/:commentId/upvote')
    async upvoteComment(
    @Param('commentId') commentId: string,
    @Body('userId') userId: number
    ): Promise<{ message: string }> {
    try {
        await this.commentService.upvoteComment(Number(commentId), userId);
        return { message: 'Upvote successful' };
    } catch (error) {
        return { message: error.message };
    }
    }

    @Post('/comments/:commentId/downvote')
    async downvoteComment(
    @Param('commentId') commentId: string,
    @Body('userId') userId: number
    ): Promise<{ message: string }> {
    try {
        await this.commentService.downvoteComment(Number(commentId), userId);
        return { message: 'Downvote successful' };
    } catch (error) {
        return { message: error.message };
    }
    }


    @Delete('comments/delete/:commentId')
    async deleteComment(
        @Param('commentId') commentId: number,
        @Query('userId') userId: number
    ): Promise<{ message: string }> {
        if (!commentId || !userId) {
        throw new BadRequestException('Comment ID and User ID are required');
        }
        try {
        await this.commentService.deleteComment(commentId, userId);
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

    @Patch('/comments/:commentId/update-votes')
    async updateCommentVotes(@Param('commentId') commentId: string): Promise<void> {
    await this.commentService.updateCommentVotes(Number(commentId));
    }
    @Post('/comments/reply')
    async addReply(
        @Body('book_id') bookId: number,
        @Body('comment_detail') commentDetail: string,
        @Body('user_id') userId: number,
        @Body('reply_id') replyId: number
    ): Promise<{ message: string }> {
        if (!bookId || !commentDetail || !userId || !replyId) {
        throw new BadRequestException('All fields (book_id, comment_detail, user_id, reply_id) are required');
        }

        try {
        await this.commentService.addReply(bookId, commentDetail, userId, replyId);
        return { message: 'Reply added successfully!' };
        } catch (error) {
        throw new InternalServerErrorException('Error adding reply');
        }
    }
}
