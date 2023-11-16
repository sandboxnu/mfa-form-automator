import { Test, TestingModule } from '@nestjs/testing';
import { SignatureFieldsController } from './signature-fields.controller';
import { SignatureFieldsService } from './signature-fields.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerServiceImpl } from '../logger/logger.service';

describe('SignatureFieldsController', () => {
  let controller: SignatureFieldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignatureFieldsController],
      providers: [SignatureFieldsService, PrismaService, LoggerServiceImpl],
    }).compile();

    controller = module.get<SignatureFieldsController>(
      SignatureFieldsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
