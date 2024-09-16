import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  comment_id: number; // Primary Key, AUTO_INCREMENT

  @ManyToOne(() => User, (user) => user.comments)
  user: User; // Foreign key to User

  @Column({ type: 'text' })
  comment_detail: string; // Required, comment content

  @Column({ type: 'int', nullable: true })
  reply_id?: number; // Optional, ID of the comment being replied to

  @Column({ type: 'int', default: 0 })
  up_vote: number; // Default to 0, upvotes

  @Column({ type: 'int', default: 0 })
  down_vote: number; // Default to 0, downvotes

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time_stamp: Date; // Timestamp of the comment
}
