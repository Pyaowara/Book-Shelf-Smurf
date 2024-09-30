import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity({ name: 'publisher'})
export class Publisher {
  @PrimaryGeneratedColumn()
  publisher_id: number; // Primary Key, AUTO_INCREMENT

  @Column({ type: 'text', nullable: true })
  publisher_name?: string; // Optional, name of the publisher

  @Column({ type: 'text', nullable: true })
  publisher_image?: string;
}
