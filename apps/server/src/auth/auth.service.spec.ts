import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { EmployeesService } from '../employees/employees.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeeSecureEntityHydrated } from '../employees/entities/employee.entity';
import { DepartmentsService } from '../departments/departments.service';
import { PositionsService } from '../positions/positions.service';
import { EmployeeScope } from '@prisma/client';
import { MockValidateEmployeeHandler } from '../employees/validate-employee/MockValidateEmployeeHandler';

describe('AuthService', () => {
  let service: AuthService;
  let employeeService: EmployeesService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        EmployeesService,
        DepartmentsService,
        PositionsService,
        PrismaService,
        JwtService,
        {
          provide: 'ValidateEmployeeHandler',
          useClass: MockValidateEmployeeHandler,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    employeeService = module.get<EmployeesService>(EmployeesService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateEmployee', () => {
    const email = 'email1@gmail.com';
    const password = 'password';
    const employeeId = 'employeeId';
    const employee = {
      id: employeeId,
      firstName: 'First',
      lastName: 'Last',
      positionId: 'positionId',
      signatureLink: 'signatureLink',
      position: {
        id: 'positionId',
        name: 'Manager',
        department: {
          id: 'departmentId',
          name: 'Archives',
        },
      },
      email: 'info@mfa.org',
      scope: EmployeeScope.BASE_USER,
      pswdHash: 'password',
      createdAt: new Date(1672531200),
      updatedAt: new Date(1672531200),
      refreshToken: null,
    };

    it('should sucessfully validate credentials', async () => {
      const expected = new EmployeeSecureEntityHydrated({
        id: employeeId,
        firstName: 'First',
        lastName: 'Last',
        positionId: 'positionId',
        signatureLink: 'signatureLink',
        position: {
          id: 'positionId',
          name: 'Manager',
          department: {
            id: 'departmentId',
            name: 'Archives',
          },
        },
        email: 'info@mfa.org',
        scope: EmployeeScope.BASE_USER,
        createdAt: new Date(1672531200),
        updatedAt: new Date(1672531200),
        refreshToken: null,
      });

      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => {
        return true;
      });
      jest
        .spyOn(employeeService, 'findOneByEmailAuth')
        .mockResolvedValue(employee);

      const result = await service.validateEmployee(email, password);
      expect(result).toEqual(expected);
    });

    it('should return null on invalid credentials', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => {
        return false;
      });
      jest
        .spyOn(employeeService, 'findOneByEmailAuth')
        .mockResolvedValue(employee);

      const result = await service.validateEmployee(email, password);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    const originalEnv = process.env;
    const jwtSecret =
      '6f4f04c51b3a6eca490347b9ae450b709f5ae40d4bd1c1003f95bf837a6e5e13';
    const jwtRefreshSecret =
      '7023c7d833140fb4b108212b93bf54dae329648d1c516b9e4700254a3ed12674';
    const validDuration = '600';
    const validRefreshDuration = '6000';

    beforeEach(() => {
      jest.resetModules();
      process.env = {
        ...originalEnv,
        JWT_SECRET: jwtSecret,
        JWT_REFRESH_SECRET: jwtRefreshSecret,
        JWT_VALID_DURATION: validDuration,
        JWT_REFRESH_VALID_DURATION: validRefreshDuration,
      };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('successfully creates a JWT token', async () => {
      const user: EmployeeSecureEntityHydrated = {
        email: 'email@gmail.com',
        id: 'userId',
        firstName: 'First',
        lastName: 'Last',
        positionId: 'position-id',
        position: {
          id: 'position-id',
          name: 'Position Name',
          department: {
            id: 'department-id',
            name: 'Department Name',
          },
        },
        scope: EmployeeScope.BASE_USER,
        pswdHash: null,
        createdAt: new Date(0),
        updatedAt: new Date(0),
        refreshToken: null,
        signatureLink: 'signatureLink',
        isActive: true,
      };
      const result = await service.login(user);
      const decodedAccessToken = jwtService.decode(result.accessToken);
      const decodedRefreshToken = jwtService.decode(result.refreshToken);

      expect(decodedAccessToken).not.toBeNull();
      expect(decodedRefreshToken).not.toBeNull();

      const decodedAccessObj = decodedAccessToken as {
        [key: string]: any;
      };
      const decodedRefreshObj = decodedRefreshToken as {
        [key: string]: any;
      };

      expect(decodedAccessObj.email).toEqual(user.email);
      expect(decodedAccessObj.firstName).toEqual(user.firstName);
      expect(decodedAccessObj.lastName).toEqual(user.lastName);
      expect(decodedAccessObj.departmentId).toEqual(
        user.position?.department?.id,
      );
      expect(decodedAccessObj.scope).toEqual(user.scope);
      expect(decodedAccessObj.sub).toEqual(user.id);
      expect((decodedAccessObj.exp - decodedAccessObj.iat).toString()).toEqual(
        process.env.JWT_VALID_DURATION,
      );

      expect(decodedRefreshObj.email).toEqual(user.email);
      expect(decodedRefreshObj.sub).toEqual(user.id);
      expect(
        (decodedRefreshObj.exp - decodedRefreshObj.iat).toString(),
      ).toEqual(process.env.JWT_REFRESH_VALID_DURATION);
    });
  });
});
