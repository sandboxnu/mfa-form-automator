import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';
import { AzureGraphValidateEmployeeHandler } from './validate-employee/AzureGraphValidateEmployeeHandler';
@Module({
  controllers: [EmployeesController],
  providers: [
    EmployeesService,
    {
      provide: 'ValidateEmployeeHandler',
      useClass: AzureGraphValidateEmployeeHandler,
    },
  ],
  imports: [PrismaModule, LoggerModule],
  exports: [EmployeesService],
})
export class EmployeesModule {}
