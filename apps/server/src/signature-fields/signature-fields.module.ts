import { Module } from '@nestjs/common';
import { SignatureFieldsService } from './signature-fields.service';
import { SignatureFieldsController } from './signature-fields.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  controllers: [SignatureFieldsController],
  providers: [SignatureFieldsService],
  imports: [PrismaModule, LoggerModule],
})
export class SignatureFieldsModule {}
