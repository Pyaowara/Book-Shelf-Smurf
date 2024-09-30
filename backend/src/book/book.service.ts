import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entity/book.entity';
import { Author } from '../entity/author.entity';
import { Comment } from '../entity/comment.entity';
import { User } from '../entity/user.entity';
import { Shop } from 'src/entity/book_shop.entity';
import { Publisher } from 'src/entity/publisher.entity';
import { Serie } from 'src/entity/serie.entity';


@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,

    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,

    @InjectRepository(Serie)
    private readonly serieRepository: Repository<Serie>

    
  ) {}

  async findAll(): Promise<Book[]> {
    return this.bookRepository.createQueryBuilder('book')
      .where('book.serie_id = :serieId OR book.book_id IN (SELECT MIN(book_id) FROM book_detail WHERE serie_id != :serieId GROUP BY serie_id)', { serieId: 1 })
      .getMany();
  }
  async findBookById(bookId: number): Promise<Book> {
    return this.bookRepository.createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.serie', 'serie')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .where('book.book_id = :bookId', { bookId })
      .getOne();
  }

  async searchBooks(name: string, category?: string): Promise<Book[]> {
    try {
      console.log('Searching for books with name:', name, 'and category:', category);
      let queryBuilder = this.bookRepository.createQueryBuilder('book');
    
      if (category) {
        queryBuilder.andWhere('FIND_IN_SET(:category, book.book_category) > 0', { category }); 
    }
      else{
        queryBuilder.where('book.book_name_en LIKE :name OR book.book_name_originl LIKE :name', { name: `%${name}%` });
    }
      console.log("Generated SQL:", queryBuilder.getQueryAndParameters());
      const results = await queryBuilder.getMany();
      if (results.length === 0) {
        throw new NotFoundException('No books found for the search query');
      }
  
      return results;
    } catch (err) {
      console.error('Error executing search:', err.message, err.stack);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async findBooksBySeriesId(seriesId: number): Promise<Book[]> {
    return this.bookRepository.createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .where('book.serie_id = :seriesId', { seriesId })
      .getMany();
  }

  async findCommentsByBookId(bookId: number): Promise<Comment[]> {
    return this.commentRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.book_id = :bookId', { bookId })
      .orderBy('comment.time_stamp', 'ASC')
      .getMany();
  }
  
  

  async upvoteComment(commentId: number): Promise<void> {
    await this.commentRepository.createQueryBuilder()
      .update(Comment)
      .set({ up_vote: () => 'up_vote + 1' })
      .where('comment_id = :commentId', { commentId })
      .execute();
  }

  async downvoteComment(commentId: number): Promise<void> {
    await this.commentRepository.createQueryBuilder()
      .update(Comment)
      .set({ down_vote: () => 'down_vote + 1' })
      .where('comment_id = :commentId', { commentId })
      .execute();
  }

  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { comment_id: commentId },
      relations: ['user']
    });
    
    if (!comment)
      throw new NotFoundException('Comment not found');
    if (comment.user.user_id !== Number(userId)){
      throw new BadRequestException('Unauthorized to delete this comment');
    }
    await this.commentRepository.delete({ comment_id: commentId });
  }

  async addComment(bookId: number, commentDetail: string, userId: number): Promise<void> {
    const book = await this.bookRepository.findOne({ where: { book_id: bookId } });
    const user = await this.userRepository.findOne({ where: { user_id: userId } });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comment = this.commentRepository.create({
      book,
      comment_detail: commentDetail,
      user,
    });

    await this.commentRepository.save(comment);
  }

  async addBook(bookData: Partial<Book>){
    const book = this.bookRepository.create(bookData);
    const saveBook = await this.bookRepository.save(book);
    return saveBook.book_id;
  }

  async addSerie(serieData: Partial<Serie>){
    const serie = this.serieRepository.create(serieData);
    const saveSerie = await this.serieRepository.save(serie);
    return saveSerie.serie_id;
  }

  async addpublisher(publisherData: Partial<Publisher>){
    const publisher = this.publisherRepository.create(publisherData);
    const savePublisher = await this.publisherRepository.save(publisher);
    return savePublisher.publisher_id;
  }

  async addShop(shops: Partial<Shop>[]){
    const shopEntities = this.shopRepository.create(shops);
    await this.shopRepository.save(shopEntities);
  }

  async findAllPublisher(): Promise<Publisher[]>{
    return await this.publisherRepository.find();
  }

  async findAllSeries(): Promise<Serie[]>{
    return await this.serieRepository.find();
  }

  async updateBook(bookId: number, bookData: Partial<Book>): Promise<number> {
    const book = await this.bookRepository.findOne({ where: { book_id: bookId } });
    if (!book) {
      throw new Error('Book not found');
    }
    Object.assign(book, bookData);
    const updatedBook = await this.bookRepository.save(book);
    return updatedBook.book_id;
  }

  async findShopByBookId(book_id: number): Promise<Shop[]> {
    return await this.shopRepository.find({ where: { book_id } });
  }


  async addReply(bookId: number, commentDetail: string, userId: number, replyId: number): Promise<void> {
    const book = await this.bookRepository.findOne({ where: { book_id: bookId } });
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    const parentComment = await this.commentRepository.findOne({ where: { comment_id: replyId } });
  
    if (!book) {
      throw new NotFoundException('Book not found');
    }
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (!parentComment) {
      throw new NotFoundException('Parent comment not found');
    }
  
    const replyComment = this.commentRepository.create({
      book,
      comment_detail: commentDetail,
      user,
      reply_id: replyId
    });
  
    await this.commentRepository.save(replyComment);
  }
  
}
