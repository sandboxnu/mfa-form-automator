import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerServiceImpl } from '../logger/logger.service';
import { EmployeeScope } from '@prisma/client';
import { MockValidateEmployeeHandler } from './validate-employee/MockValidateEmployeeHandler';
import { EmployeeSecureEntityHydrated } from './entities/employee.entity';

describe('EmployeesController', () => {
  let controller: EmployeesController;
  let employeeService: EmployeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        EmployeesService,
        PrismaService,
        LoggerServiceImpl,
        {
          provide: 'ValidateEmployeeHandler',
          useClass: MockValidateEmployeeHandler,
        },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
    employeeService = module.get<EmployeesService>(EmployeesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of employees', async () => {
      const result = [
        {
          id: '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f',
          firstName: 'John',
          lastName: 'Doe',
          positionId: 'position-id',
          signatureLink: 'signature-link',
          position: {
            id: 'position-id',
            name: 'position-name',
            department: {
              id: 'department-id',
              name: 'department-name',
            },
          },
          email: 'john.doe@example.com',
          scope: EmployeeScope.BASE_USER,
          pswdHash: 'thisIsASecureHash',
          createdAt: new Date(1672531200),
          updatedAt: new Date(1672531200),
          refreshToken: null,
        },
        {
          id: 'd6c3c7c4-5f82-4c63-9086-ad6b3f067cdc',
          firstName: 'Bilbo',
          lastName: 'Baggins',
          positionId: 'position-id',
          signatureLink: 'signature-link',
          position: {
            id: 'position-id',
            name: 'position-name',
            department: {
              id: 'department-id',
              name: 'department-name',
            },
          },
          email: 'bilbo.baggins@example.com',
          scope: EmployeeScope.BASE_USER,
          pswdHash: 'thisIsASecureHash',
          createdAt: new Date(1672531200),
          updatedAt: new Date(1672531200),
          refreshToken: null,
        },
      ];

      const expected = [
        new EmployeeSecureEntityHydrated({
          id: '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f',
          firstName: 'John',
          lastName: 'Doe',
          positionId: 'position-id',
          signatureLink: 'signature-link',
          position: {
            id: 'position-id',
            name: 'position-name',
            department: {
              id: 'department-id',
              name: 'department-name',
            },
          },
          email: 'john.doe@example.com',
          scope: EmployeeScope.BASE_USER,
          pswdHash: 'thisIsASecureHash',
          createdAt: new Date(1672531200),
          updatedAt: new Date(1672531200),
          refreshToken: null,
        }),
        new EmployeeSecureEntityHydrated({
          id: 'd6c3c7c4-5f82-4c63-9086-ad6b3f067cdc',
          firstName: 'Bilbo',
          lastName: 'Baggins',
          positionId: 'position-id',
          signatureLink: 'signature-link',
          position: {
            id: 'position-id',
            name: 'position-name',
            department: {
              id: 'department-id',
              name: 'department-name',
            },
          },
          email: 'bilbo.baggins@example.com',
          scope: EmployeeScope.BASE_USER,
          pswdHash: 'thisIsASecureHash',
          createdAt: new Date(1672531200),
          updatedAt: new Date(1672531200),
          refreshToken: null,
        }),
      ];
      jest.spyOn(employeeService, 'findOne').mockImplementation(
        async () =>
          new EmployeeSecureEntityHydrated({
            id: 'd6c3c7c4-5f82-4c63-9086-ad6b3f067cdc',
            firstName: 'Bilbo',
            lastName: 'Baggins',
            positionId: 'position-id',
            signatureLink: 'signature-link',
            position: {
              id: 'position-id',
              name: 'position-name',
              department: {
                id: 'department-id',
                name: 'department-name',
              },
            },
            email: 'bilbo.baggins@example.com',
            scope: EmployeeScope.ADMIN,
            pswdHash: 'thisIsASecureHash',
            createdAt: new Date(1672531200),
            updatedAt: new Date(1672531200),
            refreshToken: null,
          }),
      );
      jest
        .spyOn(employeeService, 'findAll')
        .mockImplementation(async () => result);

      expect(await controller.findAll({ id: '', email: '' }, 10)).toEqual({
        count: 2,
        employees: expected,
      });
    });
  });
});
