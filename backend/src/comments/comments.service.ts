import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entity/book.entity';
import { Comment } from '../entity/comment.entity';
import { User } from '../entity/user.entity';
import { Voting } from 'src/entity/voting.entity';

@Injectable()
export class CommentsService {
    constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(Voting)
    private readonly votingRepository: Repository<Voting>,){}

    async addComment(bookId: number, commentDetail: string, userId: number, score: number, spoiler: boolean): Promise<void> {
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
          spoiler
        });
      
        await this.commentRepository.save(comment);
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
    
