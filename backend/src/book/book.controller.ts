import { Controller, Get, Param, Query, Post } from '@nestjs/common';
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

  // Search books by name
  @Get('searched')
  async searchBooks(@Query('name') name: string): Promise<Book[]> {
    if (!name || name.trim() === '') {
      throw new Error('Search query cannot be empty');
    }
    return this.bookService.searchBooks(name);
  }

  // Get books by series ID
  @Get('series/:seriesId')
  async getBooksBySeriesId(@Param('seriesId') seriesId: string): Promise<Book[]> {
    return this.bookService.findBooksBySeriesId(Number(seriesId));
  }

  // Get comments for a book
  @Get(':id/comments')
  async getCommentsByBookId(@Param('id') id: string): Promise<Comment[]> {
    return this.bookService.findCommentsByBookId(Number(id));
  }

  // Upvote comment
  @Post('/comments/:commentId/upvote')
  async upvoteComment(@Param('commentId') commentId: string): Promise<{ message: string }> {
    await this.bookService.upvoteComment(Number(commentId));
    return { message: 'Upvote successful' };
  }

  // Downvote comment
  @Post('/comments/:commentId/downvote')
  async downvoteComment(@Param('commentId') commentId: string): Promise<{ message: string }> {
    await this.bookService.downvoteComment(Number(commentId));
    return { message: 'Downvote successful' };
  }
}
