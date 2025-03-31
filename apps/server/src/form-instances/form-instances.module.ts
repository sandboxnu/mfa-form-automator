import { Module } from '@nestjs/common';
import { FormInstancesService } from './form-instances.service';
import { FormInstancesController } from './form-instances.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FormTemplatesModule } from '../form-templates/form-templates.module';
import { PositionsModule } from '../positions/positions.module';
import { LoggerModule } from '../logger/logger.module';
import { PostmarkService } from '../postmark/postmark.service';
import { EmployeesModule } from '../employees/employees.module';
import { PostmarkModule } from '../postmark/postmark.module';
import { DepartmentsModule } from '../departments/departments.module';
import { DepartmentsService } from '../departments/departments.service';
import { PositionsService } from '../positions/positions.service';
import { EmployeesService } from '../employees/employees.service';
import { PdfStoreModule } from '../pdf-store/pdf-storage.module';
import PostmarkHandler from '../postmark/PostmarkHandler';
import { AzureGraphValidateEmployeeHandler } from '../employees/validate-employee/AzureGraphValidateEmployeeHandler';

@Module({
  controllers: [FormInstancesController],
  providers: [
    FormInstancesService,
    PostmarkService,
    PositionsService,
    EmployeesService,
    DepartmentsService,
    {
      provide: 'EmailHandler',
      useClass: PostmarkHandler,
    },
    {
      provide: 'ValidateEmployeeHandler',
      useClass: AzureGraphValidateEmployeeHandler,
    },
  ],
  exports: [FormInstancesService],
  imports: [
    PrismaModule,
    FormTemplatesModule,
    PositionsModule,
    LoggerModule,
    EmployeesModule,
    PostmarkModule,
    DepartmentsModule,
    PdfStoreModule,
  ],
})
export class FormInstancesModule {}
