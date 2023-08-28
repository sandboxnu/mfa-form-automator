import { Module } from '@nestjs/common';
import { FormTemplatesService } from './form-templates.service';
import { FormTemplatesController } from './form-templates.controller';

@Module({
  controllers: [FormTemplatesController],
  providers: [FormTemplatesService],
})
export class FormTemplatesModule {}
