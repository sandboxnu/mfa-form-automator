import { Test, TestingModule } from '@nestjs/testing';
import { FormTemplatesService } from './form-templates.service';

describe('FormTemplatesService', () => {
  let service: FormTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormTemplatesService],
    }).compile();

    service = module.get<FormTemplatesService>(FormTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
