import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

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
}
