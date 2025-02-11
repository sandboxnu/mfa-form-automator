import { Test, TestingModule } from '@nestjs/testing';
import { FormTemplatesService } from './form-templates.service';
import { PrismaService } from './../../../server/src/prisma/prisma.service';
import { PdfStoreService } from '../pdf-store/pdf-store.service';
import { VercelFileStorageHandler } from '../pdf-store/file-storage/VercelFileStorageHandler';
import { PdfStoreModule } from '../pdf-store/pdf-storage.module';

describe('FormTemplatesService', () => {
  let service: FormTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormTemplatesService, PrismaService],
      imports: [PdfStoreModule],
    }).compile();

    service = module.get<FormTemplatesService>(FormTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
