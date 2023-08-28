import { Module } from '@nestjs/common';
import { SignatureFieldsService } from './signature-fields.service';
import { SignatureFieldsController } from './signature-fields.controller';

@Module({
  controllers: [SignatureFieldsController],
  providers: [SignatureFieldsService],
})
export class SignatureFieldsModule {}
