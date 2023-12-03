import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { EmployeesService } from '../employees/employees.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeeEntity } from '../employees/entities/employee.entity';
import { PositionBaseEntity } from '../positions/entities/position.entity';

describe('AuthService', () => {
  let service: AuthService;
  let employeeService: EmployeesService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, EmployeesService, PrismaService, JwtService],
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
      position: {
        id: 'positionId',
        name: 'Manager',
        single: true,
        departmentId: 'departmentId',
        department: {
          id: 'departmentId',
          name: 'Archives',
          createdAt: new Date(1672531200),
          updatedAt: new Date(1672531200),
        },
        createdAt: new Date(1672531200),
        updatedAt: new Date(1672531200),
      },
      email: 'info@mfa.org',
      isAdmin: false,
      pswdHash: 'password',
      createdAt: new Date(1672531200),
      updatedAt: new Date(1672531200),
      refreshToken: null,
    };

    it('should sucessfully validate credentials', async () => {
      const expected = new EmployeeEntity({
        id: employeeId,
        firstName: 'First',
        lastName: 'Last',
        positionId: 'positionId',
        position: {
          id: 'positionId',
          name: 'Manager',
          single: true,
          departmentId: 'departmentId',
          department: {
            id: 'departmentId',
            name: 'Archives',
            createdAt: new Date(1672531200),
            updatedAt: new Date(1672531200),
          },
          createdAt: new Date(1672531200),
          updatedAt: new Date(1672531200),
        },
        email: 'info@mfa.org',
        isAdmin: false,
        createdAt: new Date(1672531200),
        updatedAt: new Date(1672531200),
        refreshToken: null,
      });

      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => {
        return true;
      });
      jest.spyOn(employeeService, 'findOneByEmail').mockResolvedValue(employee);

      const result = await service.validateEmployee(email, password);
      expect(result).toEqual(expected);
    });

    it('should return null on invalid credentials', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => {
        return false;
      });
      jest.spyOn(employeeService, 'findOneByEmail').mockResolvedValue(employee);

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
    const validRefreshDuration = '60000';

    beforeEach(() => {
      jest.resetModules();
      process.env = {
        ...originalEnv,
        JWT_SECRET: jwtSecret,
        JWT_REFRESH_SECRET: jwtRefreshSecret,
        JWT_VALID_DURATION: validDuration,
        JWT_REFRESH_DURATION: validRefreshDuration,
      };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('successfully creates a JWT token', async () => {
      const user = {
        email: 'email@gmail.com',
        id: 'userId',
        position: new PositionBaseEntity({}),
        firstName: 'First',
        lastName: 'Last',
        positionId: 'position-id',
        isAdmin: false,
        pswdHash: null,
        createdAt: new Date(0),
        updatedAt: new Date(0),
        refreshToken: null,
      };
      const result = await service.login(user);
      const decodedAccessToken = await jwtService.decode(result.accessToken);
      const decodedRefreshToken = await jwtService.decode(result.refreshToken);

      expect(decodedAccessToken).not.toBeNull();
      expect(decodedRefreshToken).not.toBeNull();

      const decodedAccessObj = decodedAccessToken as {
        [key: string]: any;
      };
      const decodedRefreshObj = decodedRefreshToken as {
        [key: string]: any;
      };

      expect(decodedAccessObj.email).toEqual(user.email);
      expect(decodedAccessObj.sub).toEqual(user.id);
      expect((decodedAccessObj.exp - decodedAccessObj.iat).toString()).toEqual(
        process.env.JWT_VALID_DURATION,
      );

      expect(decodedRefreshObj.email).toEqual(user.email);
      expect(decodedRefreshObj.sub).toEqual(user.id);
      expect(
        (decodedRefreshObj.exp - decodedRefreshObj.iat).toString(),
      ).toEqual(process.env.JWT_REFRESH_DURATION);
    });
  });
});
