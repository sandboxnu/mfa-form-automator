import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmployeesModule } from '../employees/employees.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DepartmentsModule } from '../departments/departments.module';
import { PositionsModule } from '../positions/positions.module';
import { AzureGraphValidateEmployeeHandler } from '../employees/validate-employee/AzureGraphValidateEmployeeHandler';

@Module({
  imports: [
    EmployeesModule,
    DepartmentsModule,
    PositionsModule,
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: 'ValidateEmployeeHandler',
      useClass: AzureGraphValidateEmployeeHandler,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
