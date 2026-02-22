import { Test, TestingModule } from '@nestjs/testing';
import { ModelService } from './model.service';

describe('ModelService', () => {
  let service: ModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelService],
    }).compile();

    service = module.get<ModelService>(ModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
