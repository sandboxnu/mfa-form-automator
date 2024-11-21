import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { LoggerModule } from '../logger/logger.module';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  imports: [LoggerModule],
})
export class DocumentsModule {}
