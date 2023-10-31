import { Module } from '@nestjs/common';
import { FormInstancesService } from './form-instances.service';
import { FormInstancesController } from './form-instances.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FormTemplatesModule } from '../form-templates/form-templates.module';
import { PositionsModule } from '../positions/positions.module';

@Module({
  controllers: [FormInstancesController],
  providers: [FormInstancesService],
  exports: [FormInstancesService],
  imports: [PrismaModule, FormTemplatesModule, PositionsModule],
})
export class FormInstancesModule {}
