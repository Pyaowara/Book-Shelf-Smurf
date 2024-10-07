import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate} from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity('history')
export class History {
    @PrimaryGeneratedColumn()
    history_id: number;
  
    @Column()
    user_id: number;
  
    @Column()
    book_id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    time_stamp: Date;

    @ManyToOne(() => User, (user) => user.user_id)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => Book, (book) => book.book_id)
    @JoinColumn({ name: 'book_id' })
    book: Book;

    @BeforeInsert()
    setTimeStamp() {
        this.time_stamp = new Date();
    }

    @BeforeUpdate()
    updateTimeStamp() {
        this.time_stamp = new Date();
    }
}
