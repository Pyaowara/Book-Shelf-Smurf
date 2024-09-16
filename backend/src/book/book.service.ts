import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entity/book.entity';
import { Author } from '../entity/author.entity';
import { Comment } from '../entity/comment.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.bookRepository.createQueryBuilder('book')
      .where('book.serie_id = :serieId OR book.book_id IN (SELECT MIN(book_id) FROM book_detail WHERE serie_id != :serieId GROUP BY serie_id)', { serieId: 1 })
      .getMany();
  }
  async findBookById(bookId: number): Promise<Book> {
    return this.bookRepository.createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .where('book.book_id = :bookId', { bookId })
      .getOne();
  }

  // Search books by name
  async searchBooks(name: string): Promise<Book[]> {
    return this.bookRepository.createQueryBuilder('book')
      .where('book.book_name_en LIKE :name OR book.book_name_originl LIKE :name', { name: `%${name}%` })
      .getMany();
  }

  // Get books by series ID
  async findBooksBySeriesId(seriesId: number): Promise<Book[]> {
    return this.bookRepository.createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .where('book.serie_id = :seriesId', { seriesId })
      .getMany();
  }

  // Get comments by book ID
  async findCommentsByBookId(bookId: number): Promise<Comment[]> {
    return this.commentRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.book_id = :bookId', { bookId })
      .getMany();
  }

  // Upvote comment
  async upvoteComment(commentId: number): Promise<void> {
    await this.commentRepository.createQueryBuilder()
      .update(Comment)
      .set({ up_vote: () => 'up_vote + 1' })
      .where('comment_id = :commentId', { commentId })
      .execute();
  }

  // Downvote comment
  async downvoteComment(commentId: number): Promise<void> {
    await this.commentRepository.createQueryBuilder()
      .update(Comment)
      .set({ down_vote: () => 'down_vote + 1' })
      .where('comment_id = :commentId', { commentId })
      .execute();
  }
}
