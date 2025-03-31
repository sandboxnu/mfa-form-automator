import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { EmployeesService } from './employees/employees.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { DepartmentsService } from './departments/departments.service';
import { PositionsService } from './positions/positions.service';
import { MockValidateEmployeeHandler } from './employees/validate-employee/MockValidateEmployeeHandler';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        AuthService,
        EmployeesService,
        DepartmentsService,
        PositionsService,
        JwtService,
        PrismaService,
        {
          provide: 'ValidateEmployeeHandler',
          useClass: MockValidateEmployeeHandler,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
