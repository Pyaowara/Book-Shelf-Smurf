import { Test, TestingModule } from '@nestjs/testing';
import { ForumCommentService } from './forum-comment.service';

describe('ForumCommentService', () => {
  let service: ForumCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForumCommentService],
    }).compile();

    service = module.get<ForumCommentService>(ForumCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
