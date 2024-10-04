import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'voting' })
export class Voting {
    @PrimaryColumn({ type: 'int' })
    comment_id: number;

    @PrimaryColumn({ type: 'int' })
    user_id: number;

    @Column({ type: 'text' })
    vote_type: string;
}
