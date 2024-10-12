import { Test, TestingModule } from '@nestjs/testing';
import { BookShopController } from './book-shop.controller';

describe('BookShopController', () => {
  let controller: BookShopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookShopController],
    }).compile();

    controller = module.get<BookShopController>(BookShopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
