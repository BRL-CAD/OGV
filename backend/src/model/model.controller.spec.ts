import { Test, TestingModule } from '@nestjs/testing';
import { ModelController } from './model.controller';

describe('ModelController', () => {
  let controller: ModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelController],
    }).compile();

    controller = module.get<ModelController>(ModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
