import { Test, TestingModule } from '@nestjs/testing';
import { BookShopService } from './book-shop.service';

describe('BookShopService', () => {
  let service: BookShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookShopService],
    }).compile();

    service = module.get<BookShopService>(BookShopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
