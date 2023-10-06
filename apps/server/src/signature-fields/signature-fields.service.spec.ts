import { Test, TestingModule } from '@nestjs/testing';
import { SignatureFieldsService } from './signature-fields.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SignatureFieldsService', () => {
  let service: SignatureFieldsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignatureFieldsService, PrismaService],
    }).compile();

    service = module.get<SignatureFieldsService>(SignatureFieldsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
