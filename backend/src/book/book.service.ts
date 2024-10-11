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
import { Forum } from 'src/entity/forum.entity';


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

    @InjectRepository(Forum)
    private readonly forumRepository: Repository<Forum>

    
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
  
  

  async upvoteComment(commentId: number, userId: number): Promise<void> {
    const existingVote = await this.votingRepository.findOne({
      where: { comment_id: commentId, user_id: userId },
    });
    
    console.log(`Checking vote for comment ${commentId} by user ${userId}:`, existingVote);
    
    if (existingVote) {
      if (existingVote.vote_type === 'Upvote') {
        await this.votingRepository.delete({ comment_id: commentId, user_id: userId });
        await this.commentRepository.decrement({ comment_id: commentId }, 'up_vote', 1);
      } else {
        existingVote.vote_type = 'Upvote';
        await this.votingRepository.save(existingVote);
        await this.commentRepository.increment({ comment_id: commentId }, 'up_vote', 1);
        await this.commentRepository.decrement({ comment_id: commentId }, 'down_vote', 1);
      }
    } else {
      await this.votingRepository.save({
        comment_id: commentId,
        user_id: userId,
        vote_type: 'Upvote',
      });
      await this.commentRepository.increment({ comment_id: commentId }, 'up_vote', 1);
    }
  }
  
  
  async downvoteComment(commentId: number, userId: number): Promise<void> {
    const existingVote = await this.votingRepository.findOne({
      where: { comment_id: commentId, user_id: userId },
    });
  
    if (existingVote) {
      if (existingVote.vote_type === 'Downvote') {
        await this.votingRepository.delete({ comment_id: commentId, user_id: userId });
        await this.commentRepository.decrement({ comment_id: commentId }, 'down_vote', 1);
      } else {
        existingVote.vote_type = 'Downvote';
        await this.votingRepository.save(existingVote);
        await this.commentRepository.increment({ comment_id: commentId }, 'down_vote', 1);
        await this.commentRepository.decrement({ comment_id: commentId }, 'up_vote', 1);
      }
    } else {
      await this.votingRepository.save({
        comment_id: commentId,
        user_id: userId,
        vote_type: 'Downvote',
      });
      await this.commentRepository.increment({ comment_id: commentId }, 'down_vote', 1);
    }
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

  async addComment(bookId: number, commentDetail: string, userId: number, score: number): Promise<void> {
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
      score,
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

  async addAuthor(authorData: Partial<Author>){
    const author = this.authorRepository.create(authorData);
    const saveAuthor = await this.authorRepository.save(author);
    return saveAuthor.author_id;
  }

  async findAllAuthor(): Promise<Author[]>{
    return await this.authorRepository.find();
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

  async updateCommentVotes(commentId: number): Promise<void> {
    const upvotesCount = await this.votingRepository.count({
      where: { comment_id: commentId, vote_type: 'Upvote' },
    });
  
    const downvotesCount = await this.votingRepository.count({
      where: { comment_id: commentId, vote_type: 'Downvote' },
    });
  
    await this.commentRepository.update(commentId, {
      up_vote: upvotesCount,
      down_vote: downvotesCount,
    });
  }

  async findVotesByUser(userId: number): Promise<Voting[]> {
    return this.votingRepository.find({
      where: {
      user_id: userId
      },
    });
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
