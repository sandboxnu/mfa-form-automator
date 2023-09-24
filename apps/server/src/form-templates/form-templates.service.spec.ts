import { Test, TestingModule } from '@nestjs/testing';
import { FormTemplatesService } from './form-templates.service';
import { PrismaService } from './../../../server/src/prisma/prisma.service';

describe('FormTemplatesService', () => {
  let service: FormTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormTemplatesService, PrismaService],
    }).compile();

    service = module.get<FormTemplatesService>(FormTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
