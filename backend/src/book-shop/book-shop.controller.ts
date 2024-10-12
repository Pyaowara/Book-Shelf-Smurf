import { Controller, Get, Param} from '@nestjs/common';
import { BookShopService } from './book-shop.service';


@Controller('book-shop')
export class BookShopController {
  constructor(private readonly bookShopService: BookShopService) {}

  @Get('shops/:bookId')
  async getShopsByBookId(@Param('bookId') bookId: number) {
    return this.bookShopService.findShopsByBookId(bookId);
  }
}
