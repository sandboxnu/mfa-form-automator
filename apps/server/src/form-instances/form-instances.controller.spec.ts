import { Test, TestingModule } from '@nestjs/testing';
import { FormInstancesController } from './form-instances.controller';
import { FormInstancesService } from './form-instances.service';

describe('FormInstancesController', () => {
  let controller: FormInstancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormInstancesController],
      providers: [FormInstancesService],
    }).compile();

    controller = module.get<FormInstancesController>(FormInstancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
