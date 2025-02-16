import { Module } from '@nestjs/common';
import { FormTemplatesService } from './form-templates.service';
import { FormTemplatesController } from './form-templates.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';
import { PdfStoreModule } from '../pdf-store/pdf-storage.module';

@Module({
  controllers: [FormTemplatesController],
  providers: [FormTemplatesService],
  exports: [FormTemplatesService],
  imports: [PrismaModule, PdfStoreModule, LoggerModule],
})
export class FormTemplatesModule {}
