import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity({ name: 'book_shop' })
export class Shop {
    @PrimaryGeneratedColumn()
    book_shop_id: number;

    @Column({ type: 'int' })
    book_id: number;

    @Column({ type: 'text' })
    shop_link: string;

    @Column({ type: 'text' })
    shop_detail: string;

    @Column({ type: 'longtext' })
    shop_image: string;
}