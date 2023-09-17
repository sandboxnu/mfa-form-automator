import { Test, TestingModule } from '@nestjs/testing';
import { FormInstancesService } from './form-instances.service';

describe('FormInstancesService', () => {
  let service: FormInstancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormInstancesService],
    }).compile();

    service = module.get<FormInstancesService>(FormInstancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
