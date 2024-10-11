import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { ForumComment } from './forum_comment.entity';

@Entity('forum')
export class Forum {
  @PrimaryGeneratedColumn()
  forum_id: number;

  @ManyToOne(() => User, user => user.forums)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text', charset: 'utf8mb4', collation: 'utf8mb4_0900_ai_ci' })
  forum_title: string;

  @Column({ type: 'text', charset: 'utf8mb4', collation: 'utf8mb4_0900_ai_ci' })
  hashtag: string;

  @Column({ type: 'int', default: 0 })
  upvote: number;

  @Column({ type: 'int', default: 0 })
  downvote: number;

  @Column({
    type: 'enum',
    enum: ['Normal', 'Deleted'],
    default: 'Normal',
  })
  delete_status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time_stamp: Date;

  @OneToMany(() => ForumComment, (comment) => comment.forum)
    forumComments: ForumComment[];

}
