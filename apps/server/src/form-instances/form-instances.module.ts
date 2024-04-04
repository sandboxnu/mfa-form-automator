import { Module } from '@nestjs/common';
import { FormInstancesService } from './form-instances.service';
import { FormInstancesController } from './form-instances.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FormTemplatesModule } from '../form-templates/form-templates.module';
import { PositionsModule } from '../positions/positions.module';
import { LoggerModule } from '../logger/logger.module';
import { PostmarkService } from '../postmark/postmark.service';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  controllers: [FormInstancesController],
  providers: [FormInstancesService, PostmarkService],
  exports: [FormInstancesService],
  imports: [
    PrismaModule,
    FormTemplatesModule,
    PositionsModule,
    LoggerModule,
    EmployeesModule,
  ],
})
export class FormInstancesModule {}
