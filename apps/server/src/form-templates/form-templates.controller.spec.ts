import { Test, TestingModule } from '@nestjs/testing';
import { FormTemplatesController } from './form-templates.controller';
import { FormTemplatesService } from './form-templates.service';
import { PrismaService } from './../../../server/src/prisma/prisma.service';
import { LoggerServiceImpl } from '../logger/logger.service';
import { PdfStoreService } from '../pdf-store/pdf-store.service';
import { VercelFileStorageHandler } from '../pdf-store/file-storage/VercelFileStorageHandler';
import { PdfStoreModule } from '../pdf-store/pdf-storage.module';

describe('FormTemplatesController', () => {
  let controller: FormTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormTemplatesController],
      providers: [FormTemplatesService, PrismaService, LoggerServiceImpl],
      imports: [PdfStoreModule],
    }).compile();

    controller = module.get<FormTemplatesController>(FormTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
