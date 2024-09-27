import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class Serie {
  @PrimaryGeneratedColumn()
  serie_id: number; // Primary Key, AUTO_INCREMENT

  @Column({ type: 'text', nullable: true })
  serie_name_th?: string; // Optional, name of the series
  
  @Column({ type: 'text', nullable: true })
  serie_name_en?: string; // Optional, name of the series

  @Column({ type: 'text', nullable: true })
  serie_name_original?: string; // Optional, name of the series

  @Column({
    type: 'enum',
    enum: ['Finished', 'On Going', 'On Hold', 'Unknown'],
    default: 'Unknown',
  })
  serie_status: 'Finished' | 'On Going' | 'On Hold' | 'Unknown'; // Enum for series status

  @Column({ type: 'text', nullable: true })
  serie_detail?: string;

}
