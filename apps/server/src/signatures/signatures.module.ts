import { Module } from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { SignaturesController } from './signatures.controller';
import { LoggerModule } from '../logger/logger.module';
import { PrismaModule } from '../prisma/prisma.module';
import { EmployeesModule } from '../employees/employees.module';
import { DepartmentsModule } from '../departments/departments.module';
import { PositionsModule } from '../positions/positions.module';

@Module({
  controllers: [SignaturesController],
  providers: [SignaturesService],
  imports: [
    LoggerModule,
    PrismaModule,
    EmployeesModule,
    DepartmentsModule,
    PositionsModule,
  ],
})
export class SignaturesModule {}
