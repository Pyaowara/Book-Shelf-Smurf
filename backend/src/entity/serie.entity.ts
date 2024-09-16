import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class Serie {
  @PrimaryGeneratedColumn()
  serie_id: number; // Primary Key, AUTO_INCREMENT

  @Column({ type: 'text', nullable: true })
  serie_name?: string; // Optional, name of the series

  @Column({
    type: 'enum',
    enum: ['Finished', 'On Going', 'On Hold', 'Unknown'],
    default: 'Unknown',
  })
  serie_status: 'Finished' | 'On Going' | 'On Hold' | 'Unknown'; // Enum for series status

  @OneToMany(() => Book, (Book) => Book.serie)
  books: Book[]; // Relation to books in the series
}
