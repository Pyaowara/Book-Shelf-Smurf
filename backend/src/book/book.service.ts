import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Book } from '../entity/book.entity';
import { Author } from '../entity/author.entity';
import { Comment } from '../entity/comment.entity';
import { User } from '../entity/user.entity';
import { Shop } from 'src/entity/book_shop.entity';
import { Publisher } from 'src/entity/publisher.entity';
import { Serie } from 'src/entity/serie.entity';
import { Voting } from 'src/entity/voting.entity';
import { History } from 'src/entity/history.entity';
import { Favorite } from 'src/entity/favorite.entity';

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
    private readonly serieRepository: Repository<Serie>,

    @InjectRepository(Voting)
    private readonly votingRepository: Repository<Voting>,

    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,

    @InjectRepository(Favorite)
    private readonly farvoriteRepository: Repository<Favorite>,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.bookRepository.createQueryBuilder('book')
      .where('book.serie_id = :serieId OR book.book_id IN (SELECT MIN(book_id) FROM book_detail WHERE serie_id != :serieId GROUP BY serie_id)', { serieId: 1 })
      .getMany();
  }

  async findAlls(): Promise<Book[]> {
    return this.bookRepository.createQueryBuilder('book')
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
      let queryBuilder = this.bookRepository.createQueryBuilder('book');
    
      if (category) {
        queryBuilder.andWhere('FIND_IN_SET(:category, book.book_category) > 0', { category }); 
    }
      else{
        queryBuilder.where('book.book_name_en LIKE :name OR book.book_name_originl LIKE :name', { name: `%${name}%` });
    }
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
  
  async addHistory(historyData: Partial<History>){
    const existingHistory = await this.historyRepository.findOne({
      where: {
          user_id: historyData.user_id,
          book_id: historyData.book_id,
      },
    });
    if (existingHistory) {
      existingHistory.time_stamp = new Date();
      await this.historyRepository.save(existingHistory);
      return;
    }
    const history = this.historyRepository.create(historyData);
    const savehistory = await this.historyRepository.save(history);
    return savehistory.history_id;
  }

  async getHistoryById(user_id: number): Promise<History[]> {
    return this.historyRepository.find({
      where: { user_id: user_id },
      relations: ['user', 'book'],
    });
  }

  async addfavorite(favoriteData: Partial<Favorite>){
    const existingFavorite = await this.farvoriteRepository.findOne({
      where: {
          user_id: favoriteData.user_id,
          book_id: favoriteData.book_id,
      },
    });
    if (existingFavorite) {
      existingFavorite.time_stamp = new Date();
      await this.farvoriteRepository.save(existingFavorite);
      return;
    }
    const favorite = this.farvoriteRepository.create(favoriteData);
    const savefavorite = await this.farvoriteRepository.save(favorite);
    return savefavorite.favorite_id;
  }

  async dropHistory(user_id:number){
    const result = await this.historyRepository.delete({
      user_id: user_id,
    });
    if (result.affected === 0) {
      throw new NotFoundException('History not found');
    }
  }

  async dropBook(book_id:number){
    const [result_1, result_2] = await Promise.all([
      this.bookRepository.delete({ book_id }),
      this.shopRepository.delete({ book_id }),
    ]);
    if (result_1.affected === 0) {
      throw new NotFoundException('Book not found');
    }
  }

  async dropFavorite(favoriteData: Partial<Favorite>){
    const result = await this.farvoriteRepository.delete({
      user_id: favoriteData.user_id,
      book_id: favoriteData.book_id,
    });
    if (result.affected === 0) {
      throw new NotFoundException('Favorite not found');
    }
  }

  async getFavoriteById(user_id: number): Promise<Favorite[]> {
    return this.farvoriteRepository.find({
      where: { user_id: user_id },
      relations: ['user', 'book'],
    });
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

  async addAuthor(authorData: Partial<Author>){
    const author = this.authorRepository.create(authorData);
    const saveAuthor = await this.authorRepository.save(author);
    return saveAuthor.author_id;
  }

  async findAllAuthor(): Promise<Author[]>{
    return await this.authorRepository.find();
  }

  async updateBookScore(bookId: number): Promise<void> {
    const comments = await this.commentRepository.find({
      where: { book: { book_id: bookId }, score: Between(1, 5) },
    });
    if (comments.length === 0) {
      await this.bookRepository.update(bookId, { book_score: 0 });
      return;
    }
  
    const averageScore = comments.reduce((sum, comment) => sum + comment.score, 0) / comments.length;
  
    await this.bookRepository.update(bookId, { book_score: averageScore });
  }

  async hasUserVoted(commentId: number, userId: number): Promise<boolean> {
    const existingVote = await this.votingRepository.findOne({ where: { comment_id: commentId, user_id: userId } });
    return !!existingVote;
  }

  async findVotesByUser(userId: number): Promise<Voting[]> {
    return this.votingRepository.find({
      where: {
      user_id: userId
      },
    });
  }
}
