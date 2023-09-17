import { Test, TestingModule } from '@nestjs/testing';
import { FormTemplatesController } from './form-templates.controller';
import { FormTemplatesService } from './form-templates.service';

describe('FormTemplatesController', () => {
  let controller: FormTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormTemplatesController],
      providers: [FormTemplatesService],
    }).compile();

    controller = module.get<FormTemplatesController>(FormTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
