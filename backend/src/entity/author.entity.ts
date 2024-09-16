import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  author_id: number; // Primary Key, AUTO_INCREMENT

  @Column({ type: 'text' })
  author_name: string; // Required

  @Column({ type: 'text', nullable: true })
  author_description?: string; // Optional text

  @Column({ type: 'text', nullable: true })
  author_image?: string; // Optional text (URL of the author's image)

  @OneToMany(() => Book, (bookDetail) => bookDetail.author)
  books: Book[]; // Relation to books written by the author
}
