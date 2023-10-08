import { Test, TestingModule } from '@nestjs/testing';
import { FormInstancesController } from './form-instances.controller';
import { FormInstancesService } from './form-instances.service';
import { PrismaService } from '../prisma/prisma.service';
import { FormTemplatesService } from '../form-templates/form-templates.service';

describe('FormInstancesController', () => {
  let controller: FormInstancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormInstancesController],
      providers: [FormInstancesService, FormTemplatesService, PrismaService],
    }).compile();

    controller = module.get<FormInstancesController>(FormInstancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
