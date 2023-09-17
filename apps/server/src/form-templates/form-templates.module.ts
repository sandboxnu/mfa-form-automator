import { Module } from '@nestjs/common';
import { FormTemplatesService } from './form-templates.service';
import { FormTemplatesController } from './form-templates.controller';

@Module({
  controllers: [FormTemplatesController],
  providers: [FormTemplatesService],
  exports: [FormTemplatesService]
})
export class FormTemplatesModule {}
