import { Module } from '@nestjs/common';
import { FormInstancesService } from './form-instances.service';
import { FormInstancesController } from './form-instances.controller';
import { FormTemplatesService } from '@server/form-templates/form-templates.service';

@Module({
  controllers: [FormInstancesController],
  providers: [FormInstancesService],
  imports: [FormTemplatesService]
})
export class FormInstancesModule {}
