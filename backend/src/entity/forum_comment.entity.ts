import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  import { Forum } from './forum.entity';
  
  @Entity('forum_comment')
  export class ForumComment {
    @PrimaryGeneratedColumn()
    forum_comment_id: number;
  
    @Column()
    user_id: number;
  
    @Column()
    forum_id: number;
  
    @Column({ nullable: true })
    forum_comment_reply_id: number | null;

    @Column({ type: 'text', name: 'comment', charset: 'utf8mb4', collation: 'utf8mb4_general_ci' })
    comment: string;
  
    @Column('text')
    spoiler: string;
  
    @Column({ default: 0 })
    upvote: number;
  
    @Column({ default: 0 })
    downvote: number;
  
    @Column({
      type: 'enum',
      enum: ['Normal', 'Deleted'],
      default: 'Normal',
    })
    delete_status: 'Normal' | 'Deleted';
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    time_stamp: Date;
  
    @ManyToOne(() => User, (user) => user.forumComments)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => Forum, (forum) => forum.forumComments)
    @JoinColumn({ name: 'forum_id' })
    forum: Forum;
  
    @ManyToOne(() => ForumComment, (comment) => comment.replies, { nullable: true })
    @JoinColumn({ name: 'forum_comment_reply_id' })
    parentComment: ForumComment;
  
    @OneToMany(() => ForumComment, (comment) => comment.parentComment)
    replies: ForumComment[];
  }
  