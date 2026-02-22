import { Test, TestingModule } from '@nestjs/testing';
import { ConverterService } from './converter.service';

describe('ConverterService', () => {
  let service: ConverterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConverterService],
    }).compile();

    service = module.get<ConverterService>(ConverterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
