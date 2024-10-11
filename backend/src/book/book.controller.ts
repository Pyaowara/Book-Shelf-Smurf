import { Controller, Get, Param, Query, Post, BadRequestException, NotFoundException, InternalServerErrorException, Body, Patch } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from '../entity/book.entity';
import { Shop } from 'src/entity/book_shop.entity';
import { Serie } from 'src/entity/serie.entity';
import { Publisher } from 'src/entity/publisher.entity';
import { Author } from 'src/entity/author.entity';
import { History } from 'src/entity/history.entity';
import { Favorite } from 'src/entity/favorite.entity';



@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService,) {}

  @Get()
  async findAll() {
    return this.bookService.findAll();
  }

  @Get('/all')
  async findAlls() {
    return this.bookService.findAlls();
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

  @Get('series/:seriesId')
  async findBooksBySeriesId(@Param('seriesId') seriesId: string): Promise<Book[]> {
    return this.bookService.findBooksBySeriesId(Number(seriesId));
  }

  @Post('/add/book')
  async addBook(@Body() bookData: Partial<Book>): Promise<{ message: string, book_id: number }> {
    const bookId = await this.bookService.addBook(bookData);
    return { message: 'Add Book successful', book_id: bookId };
  }

  @Post('/add/serie')
  async addSerie(@Body() serieData: Partial<Serie>): Promise<{ message: string, serie_id: number }> {
    const serieId = await this.bookService.addSerie(serieData);
    return { message: 'Add Serie successful', serie_id: serieId };
  }

  @Post('/add/shop')
  async addShop(@Body() shops: Partial<Shop>[]) {
    await this.bookService.addShop(shops);
    return { message: 'Add Shop successful' };
  }

  @Post('/add/publisher')
  async addPublisher(@Body() publisherData: Partial<Publisher>): Promise<{ message: string, publisher_id: number }> {
    const publisherId = await this.bookService.addpublisher(publisherData);
    return { message: 'Add Publisher successful', publisher_id: publisherId };
  }

  @Get('/get/publisher')
  async findPublisher() {
    return this.bookService.findAllPublisher();
  }

  @Get('/get/serie')
  async findSerie() {
    return this.bookService.findAllSeries();
  }

  @Post('/update/book/:bookId')
  async updateBook(
    @Param('bookId') bookId: number,
    @Body() bookData: Partial<Book>
  ): Promise<{ message: string; book_id: number }> {
    const updatedBookId = await this.bookService.updateBook(bookId, bookData);
    return { message: 'Update Book successful', book_id: updatedBookId };
  }

  @Get('/get/shop/:bookId')
  async getShop(@Param('bookId') bookId: number){
    return this.bookService.findShopByBookId(bookId);
  }

  @Post('/add/author')
  async addAuthor(@Body() authorData: Partial<Author>): Promise<{ message: string, author_id: number }> {
    const authorId = await this.bookService.addAuthor(authorData);
    return { message: 'Add Author successful', author_id: authorId };
  }

  @Get('/get/author')
  async findAuthor() {
    return this.bookService.findAllAuthor();
  }

  @Post('/add/history')
  async addHistory(@Body() historyData: Partial<History>): Promise<{ message: string, history_id: number }> {
    const historyId = await this.bookService.addHistory(historyData);
    return { message: 'Add History successful', history_id: historyId };
  }

  @Post('/add/favorite')
  async addFavorite(@Body() favoriteData: Partial<Favorite>): Promise<{ message: string, favorite_id: number }> {
    const favoriteId = await this.bookService.addfavorite(favoriteData);
    return { message: 'Add Favorite successful', favorite_id: favoriteId };
  }

  @Get('/get/history/:userId')
  async getHistoryById(
    @Param('userId') userId: number,
  ): Promise<History[]> {
    return this.bookService.getHistoryById(userId);
  }

  @Get('/get/favorite/:userId')
  async getFavoriteById(
    @Param('userId') userId: number,
  ): Promise<Favorite[]> {
    return this.bookService.getFavoriteById(userId);
  }

  @Post('/drop/favorite')
  async droupFavorite(
    @Body() favoriteData: Partial<Favorite>
  ): Promise<{ message: string}> {
    await this.bookService.dropFavorite(favoriteData);
    return { message: 'drop successful' };
  }

  @Get('/drop/history/:userId')
  async droupHistory(
    @Param('userId') userId: number,
  ): Promise<{ message: string}> {
    await this.bookService.dropHistory(userId);
    return { message: 'drop successful'};
  }

  @Get('/drop/book/:bookId')
  async dropBook(
    @Param('bookId') bookId: number,
  ): Promise<{ message: string}> {
    await this.bookService.dropBook(bookId);
    return { message: 'drop successful'};
  }

  @Patch('/:id/update-score')
  async updateBookScore(@Param('id') bookId: number): Promise<{ message: string }> {
    try {
      await this.bookService.updateBookScore(bookId);
      return { message: 'Book score updated successfully!' };
    } catch (error) {
      throw new InternalServerErrorException('Error updating book score');
    }
  }

  @Get('/voting-status/:userId')
  async getVotingStatus(@Param('userId') userId: number) {
    return this.bookService.findVotesByUser(userId);
  }

}
