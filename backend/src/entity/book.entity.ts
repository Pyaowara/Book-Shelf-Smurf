import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Author } from './author.entity';
import { Publisher } from './publisher.entity';
import { Serie } from './serie.entity';
import { Comment } from './comment.entity';

@Entity({ name: 'book_detail' })
export class Book {
  @PrimaryGeneratedColumn()
  book_id: number;

  @Column({ type: 'text', nullable: true })
  book_name_th?: string;

  @Column({ type: 'text', nullable: true })
  book_name_en?: string;

  @Column({ type: 'text' })
  book_name_originl: string;

  @Column({ type: 'set', enum: ['Fiction', 'Fantasy', 'Science Fiction', 'Mystery'], default: [] })
  book_category: string[];

  @Column({ type: 'text', nullable: true })
  book_descriptions?: string;

  @Column({ type: 'enum', enum: ['Not Available', 'Now Available', 'Unknown'], default: 'Unknown' })
  book_status: 'Not Available' | 'Now Available' | 'Unknown';

  @Column({ type: 'float', default: 0 })
  book_score: number;

  @Column({ type: 'float', default: 0 })
  book_price: number;

  @Column({ type: 'int', default: 0 })
  book_pages: number;

  @Column({ type: 'text', nullable: true })
  book_image?: string;

  @Column({ type: 'date', nullable: true })
  release_date?: Date;

  @Column({ type: 'text', nullable: true })
  publisher_link?: string;

  @ManyToOne(() => Author, (author) => author.books)
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @ManyToOne(() => Publisher, (publisher) => publisher.books)
  @JoinColumn({ name: 'publisher_id' })
  publisher: Publisher;

  @ManyToOne(() => Serie, (series) => series.books)
  @JoinColumn({ name: 'serie_id' })
  serie: Serie;

  @OneToMany(() => Comment, (comment) => comment.book)
  comments: Comment[];
}
