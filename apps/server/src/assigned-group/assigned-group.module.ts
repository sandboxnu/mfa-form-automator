import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FormTemplatesModule } from '../form-templates/form-templates.module';
import { PositionsModule } from '../positions/positions.module';
import { LoggerModule } from '../logger/logger.module';
import { EmployeesModule } from '../employees/employees.module';
import { PostmarkModule } from '../postmark/postmark.module';
import { AssignedGroupController } from './assigned-group.controller';
import { AssignedGroupService } from './assigned-group.service';
import { DepartmentsModule } from '../departments/departments.module';

@Module({
  controllers: [AssignedGroupController],
  providers: [AssignedGroupService],
  exports: [AssignedGroupService],
  imports: [
    PrismaModule,
    FormTemplatesModule,
    PositionsModule,
    LoggerModule,
    EmployeesModule,
    DepartmentsModule,
    PostmarkModule,
  ],
})
export class AssignedGroupModule {}
