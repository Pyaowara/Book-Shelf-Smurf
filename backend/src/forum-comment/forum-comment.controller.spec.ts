import { Test, TestingModule } from '@nestjs/testing';
import { ForumCommentController } from './forum-comment.controller';

describe('ForumCommentController', () => {
  let controller: ForumCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForumCommentController],
    }).compile();

    controller = module.get<ForumCommentController>(ForumCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
