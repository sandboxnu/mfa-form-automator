import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EmployeesModule } from './employees/employees.module';
import { PositionsModule } from './positions/positions.module';
import { SignatureFieldsModule } from './signature-fields/signature-fields.module';
import { SignaturesModule } from './signatures/signatures.module';
import { FormInstancesModule } from './form-instances/form-instances.module';
import { FormTemplatesModule } from './form-templates/form-templates.module';

@Module({
  imports: [PrismaModule, EmployeesModule, PositionsModule, SignatureFieldsModule, SignaturesModule, FormInstancesModule, FormTemplatesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
