import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn({ name: 'comment_id' })
  comment_id: number;

  @ManyToOne(() => User, user => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Book, book => book.comments)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ type: 'text', name: 'comment_detail', charset: 'utf8mb4', collation: 'utf8mb4_general_ci' })
  comment_detail: string;

  @Column({ type: 'int', nullable: true, name: 'reply_id' })
  reply_id?: number;

  @Column({ type: 'int', default: 0, name: 'up_vote' })
  up_vote: number;

  @Column({ type: 'int', default: 0, name: 'down_vote' })
  down_vote: number;

  @Column({ type: 'int', default: 0, name: 'score' })
  score: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'time_stamp' })
  time_stamp: Date;

  @Column({ type: 'tinyint', default: 0, name: 'spoiler' })
  spoiler: boolean;
}
