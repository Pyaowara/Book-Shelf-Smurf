import { Controller, Get, Param, Query, Post, BadRequestException, NotFoundException, InternalServerErrorException, Delete, Body } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from '../entity/book.entity';
import { Comment } from '../entity/comment.entity';


@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  async getBookById(@Param('id') id: string): Promise<Book> {
    return this.bookService.findBookById(Number(id));
  }

  @Get('searched/f')
  async searchBooks(
    @Query('name') name: string,
    @Query('category') category?: string
  ) {
    try {
      const books = await this.bookService.searchBooks(name, category);
      return books;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }



@Post('/comments/add')
async addComment(
  @Body('book_id') bookId: number,
  @Body('comment_detail') commentDetail: string,
  @Body('user_id') userId: number
): Promise<{ message: string }> {
  if (!bookId || !commentDetail || !userId) {
    throw new BadRequestException('All fields (book_id, comment_detail, user_id) are required');
  }

  try {
    await this.bookService.addComment(bookId, commentDetail, userId);
    return { message: 'Comment added successfully!' };
  } catch (error) {
    throw new InternalServerErrorException('Error adding comment');
  }
}

  @Get('series/:seriesId')
  async findBooksBySeriesId(@Param('seriesId') seriesId: string): Promise<Book[]> {
    return this.bookService.findBooksBySeriesId(Number(seriesId));
  }

  @Get(':id/comments')
  async findCommentsByBookId(@Param('id') id: string): Promise<Comment[]> {
    return this.bookService.findCommentsByBookId(Number(id));
  }

  @Post('/comments/:commentId/upvote')
  async upvoteComment(@Param('commentId') commentId: string): Promise<{ message: string }> {
    await this.bookService.upvoteComment(Number(commentId));
    return { message: 'Upvote successful' };
  }

  @Post('/comments/:commentId/downvote')
  async downvoteComment(@Param('commentId') commentId: string): Promise<{ message: string }> {
    await this.bookService.downvoteComment(Number(commentId));
    return { message: 'Downvote successful' };
  }

  @Delete('comments/delete/:commentId')
  async deleteComment(
    @Param('commentId') commentId: number,
    @Query('userId') userId: number
  ): Promise<{ message: string }> {
    console.log(commentId, userId);
    if (!commentId || !userId) {
      throw new BadRequestException('Comment ID and User ID are required');
    }
    try {
      await this.bookService.deleteComment(commentId, userId);
      return { message: 'Comment deleted successfully' };
    } catch (error) {
      console.log("Im here");
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Comment not found');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Unauthorized to delete this comment');
      } else {
        throw new InternalServerErrorException('Error deleting comment');
      }
    }
  }

  @Post('/add/book')
  async addBook(@Body() bookData: Partial<Book>): Promise<{ message: string }>{
    await this.bookService.addBook(bookData);
    return { message: 'Add Book successful' };
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
      await this.bookService.addReply(bookId, commentDetail, userId, replyId);
      return { message: 'Reply added successfully!' };
    } catch (error) {
      throw new InternalServerErrorException('Error adding reply');
    }
  }

}
