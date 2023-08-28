import { Module } from '@nestjs/common';
import { FormInstancesService } from './form-instances.service';
import { FormInstancesController } from './form-instances.controller';

@Module({
  controllers: [FormInstancesController],
  providers: [FormInstancesService],
})
export class FormInstancesModule {}
