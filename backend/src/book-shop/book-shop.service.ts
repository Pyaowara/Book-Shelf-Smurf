import { Injectable } from '@nestjs/common';
import { Shop } from 'src/entity/book_shop.entity';
import { Repository, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookShopService {
  constructor(
    @InjectRepository(Shop)
    private ShopRepository: Repository<Shop>,
  ) {}

  async findShopsByBookId(bookId: number): Promise<Shop[]> {
    return await this.ShopRepository.find({ where: { book_id: bookId } });
  }
}
