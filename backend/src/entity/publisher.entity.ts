import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class Publisher {
  @PrimaryGeneratedColumn()
  publisher_id: number; // Primary Key, AUTO_INCREMENT

  @Column({ type: 'text', nullable: true })
  publisher_name?: string; // Optional, name of the publisher

  @OneToMany(() => Book, (Book) => Book.publisher)
  books: Book[]; // Relation to the books published by this publisher
}
