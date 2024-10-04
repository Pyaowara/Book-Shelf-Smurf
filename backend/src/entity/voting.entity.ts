import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity({ name: 'voting'})
export class Voting {
    @PrimaryGeneratedColumn({ type : 'int'})
    comment_id: number;

    @Column({ type : 'int'})
    user_id: number;

    @Column({ type : 'text'})
    vote_type: string;

}