import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comment } from './comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number; // Primary Key, AUTO_INCREMENT

  @Column({ type: 'text' })
  user_name: string; // Required, username

  @Column({ type: 'text' })
  user_pass: string; // Required, password (hashed)

  @Column({ type: 'text' })
  user_email: string; // Required, email address

  @Column({ type: 'text' })
  user_phone: string; // Required, phone number

  @Column({ type: 'text' })
  user_permission: string; // Required, user role or permissions

  @Column({ type: 'text', nullable: true })
  user_image?: string; // Optional, profile image

  @Column({ type: 'text', nullable: true })
  user_descriptions?: string; // Optional, user description

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[]; // Relation to comments made by the user
}
