import { TestingModule, Test } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { PrismaService } from '../prisma/prisma.service';
import { PositionsService } from '../positions/positions.service';
import { DepartmentsService } from '../departments/departments.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { $Enums } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ValidateEmployeeHandler } from './validate-employee/ValidateEmployeeHandlerInterface';
import { MockValidateEmployeeHandler } from './validate-employee/MockValidateEmployeeHandler';
import { EmployeeErrorMessage } from './employees.errors';

describe('EmployeesServiceIntegrationTest', () => {
  let module: TestingModule;
  let service: EmployeesService;
  let departmentsService: DepartmentsService;
  let positionsService: PositionsService;
  let validateEmployeeHandler: ValidateEmployeeHandler;

  let departmentId: string;
  let positionId1: string;
  let positionId2: string;
  let employeeId1: string;
  let employeeId2: string;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        EmployeesService,
        PositionsService,
        DepartmentsService,
        PrismaService,
        {
          provide: 'ValidateEmployeeHandler',
          useClass: MockValidateEmployeeHandler,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    positionsService = module.get<PositionsService>(PositionsService);
    validateEmployeeHandler = module.get<ValidateEmployeeHandler>(
      'ValidateEmployeeHandler',
    );
  });

  beforeEach(async () => {
    // We need to seed the database with some data
    await module
      .get<PrismaService>(PrismaService)
      .$transaction([
        module.get<PrismaService>(PrismaService).instanceBox.deleteMany(),
        module.get<PrismaService>(PrismaService).assignedGroup.deleteMany(),
        module.get<PrismaService>(PrismaService).formInstance.deleteMany(),
        module.get<PrismaService>(PrismaService).templateBox.deleteMany(),
        module.get<PrismaService>(PrismaService).fieldGroup.deleteMany(),
        module.get<PrismaService>(PrismaService).formTemplate.deleteMany(),
        module.get<PrismaService>(PrismaService).employee.deleteMany(),
        module.get<PrismaService>(PrismaService).department.deleteMany(),
        module.get<PrismaService>(PrismaService).position.deleteMany(),
      ]);
    await module.get<PrismaService>(PrismaService).employee.deleteMany();
    await module.get<PrismaService>(PrismaService).department.deleteMany();

    departmentId = (await departmentsService.create({ name: 'Engineering' }))
      .id;
    positionId1 = (
      await positionsService.create({
        name: 'Software Engineer',
        departmentId,
      })
    ).id;
    positionId2 = (
      await positionsService.create({
        name: 'QA Engineer',
        departmentId,
      })
    ).id;
  });
  describe('createAndValidate', () => {
    beforeEach(async () => {
      jest
        .spyOn(validateEmployeeHandler, 'validateEmployee')
        .mockResolvedValue(true);
    });

    describe('success', () => {
      it('successfully creates and validates an employee', async () => {
        const employeeDto: CreateEmployeeDto = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password',
          scope: $Enums.EmployeeScope.ADMIN,
          positionId: positionId1,
          accessToken: '123456',
        };

        const newEmployee = await service.createAndValidate(employeeDto);
        expect(newEmployee).toBeDefined();
        expect(newEmployee).toBeDefined();
        expect(newEmployee.id).toBeDefined();
        expect(newEmployee.firstName).toBe(employeeDto.firstName);
        expect(newEmployee.lastName).toBe(employeeDto.lastName);
        expect(newEmployee.email).toBe(employeeDto.email);
        expect(newEmployee.scope).toBe(employeeDto.scope);
        expect(newEmployee.refreshToken).toBeNull();
        expect(newEmployee.pswdHash).toBeDefined();
        expect(
          bcrypt.compare(employeeDto.password, newEmployee.pswdHash!),
        ).toBeTruthy();
        expect(validateEmployeeHandler.validateEmployee).toHaveBeenCalled();
      });

      describe('fail', () => {
        beforeEach(() => {
          jest
            .spyOn(validateEmployeeHandler, 'validateEmployee')
            .mockResolvedValue(false);
        });

        it('should throw an error if the employee is not valid', async () => {
          const employeeDto: CreateEmployeeDto = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password',
            scope: $Enums.EmployeeScope.ADMIN,
            positionId: positionId1,
            accessToken: '123456',
          };
          expect(service.createAndValidate(employeeDto)).rejects.toThrow(
            EmployeeErrorMessage.EMPLOYEE_NOT_FOUND_IN_AUTH_PROVIDER,
          );
        });
      });
    });

    describe;

    describe('create', () => {
      it('successfully creates a new employee', async () => {
        const employeeDto: CreateEmployeeDto = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password',
          scope: $Enums.EmployeeScope.ADMIN,
          positionId: positionId1,
          accessToken: '123456',
        };

        const newEmployee = await service.create(employeeDto);
        expect(newEmployee).toBeDefined();
        expect(newEmployee.id).toBeDefined();
        expect(newEmployee.firstName).toBe(employeeDto.firstName);
        expect(newEmployee.lastName).toBe(employeeDto.lastName);
        expect(newEmployee.email).toBe(employeeDto.email);
        expect(newEmployee.scope).toBe(employeeDto.scope);
        expect(newEmployee.refreshToken).toBeNull();
        expect(newEmployee.pswdHash).toBeDefined();
        expect(
          bcrypt.compare(employeeDto.password, newEmployee.pswdHash!),
        ).toBeTruthy();
      });
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      const employeeDto1: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        scope: $Enums.EmployeeScope.BASE_USER,
        positionId: positionId1,
        accessToken: '123456',
      };
      employeeId1 = (await service.create(employeeDto1)).id;
      await module.get<PrismaService>(PrismaService).employee.update({
        where: {
          id: employeeId1,
        },
        data: {
          position: {
            connect: {
              id: positionId1,
            },
          },
        },
      });
    });

    it('successfully updates an employee', async () => {
      const updatedEmployee = await service.update(employeeId1, {
        firstName: 'Jane',
        lastName: 'Smith',
        scope: $Enums.EmployeeScope.ADMIN,
        positionId: positionId2,
        signatureLink: 'new signature link',
      });
      expect(updatedEmployee).toBeDefined();
      expect(updatedEmployee.id).toBe(employeeId1);
      expect(updatedEmployee.firstName).toBe('Jane');
      expect(updatedEmployee.lastName).toBe('Smith');
      expect(updatedEmployee.scope).toBe($Enums.EmployeeScope.ADMIN);
      expect(updatedEmployee.positionId).toBe(positionId2);
      expect(updatedEmployee.position?.departmentId).toBe(departmentId);
      expect(updatedEmployee.signatureLink).toBe('new signature link');
    });
  });

  describe('setRefreshToken', () => {
    beforeEach(async () => {
      const employeeDto1: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        scope: $Enums.EmployeeScope.BASE_USER,
        positionId: positionId1,
        accessToken: '123456',
      };
      employeeId1 = (await service.create(employeeDto1)).id;
      await module.get<PrismaService>(PrismaService).employee.update({
        where: {
          id: employeeId1,
        },
        data: {
          position: {
            connect: {
              id: positionId1,
            },
          },
        },
      });
    });

    it('successfully updates a refresh token', async () => {
      const updatedEmployee = await service.setRefreshToken(
        employeeId1,
        'token',
      );
      expect(updatedEmployee).toBeDefined();
      expect(updatedEmployee.refreshToken).toBe('token');
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      const employeeDto1: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        scope: $Enums.EmployeeScope.ADMIN,
        positionId: positionId1,
        accessToken: '123456',
      };
      const employeeDto2: CreateEmployeeDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
        scope: $Enums.EmployeeScope.ADMIN,
        positionId: positionId2,
        accessToken: '123456',
      };
      employeeId1 = (await service.create(employeeDto1)).id;
      employeeId2 = (await service.create(employeeDto2)).id;
      await module.get<PrismaService>(PrismaService).employee.update({
        where: {
          id: employeeId1,
        },
        data: {
          position: {
            connect: {
              id: positionId1,
            },
          },
        },
      });
      await module.get<PrismaService>(PrismaService).employee.update({
        where: {
          id: employeeId2,
        },
        data: {
          position: {
            connect: {
              id: positionId2,
            },
          },
        },
      });
    });

    it('successfully retrieves all employees', async () => {
      const employees = await service.findAll();
      expect(employees).toHaveLength(2);
      // Check that both position IDs are present, but don't enforce a specific order
      expect([positionId1, positionId2]).toContain(employees[0].positionId);
      expect([positionId1, positionId2]).toContain(employees[1].positionId);
      expect(employees[0].position?.departmentId).toBe(departmentId);
      expect(employees[1].position?.departmentId).toBe(departmentId);
    });
    it('successfully retrieves a limited number of employees', async () => {
      const employees = await service.findAll(1);
      expect(employees).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      const employeeDto1: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        scope: $Enums.EmployeeScope.ADMIN,
        positionId: positionId1,
        accessToken: '123456',
      };
      employeeId1 = (await service.create(employeeDto1)).id;
      await module.get<PrismaService>(PrismaService).employee.update({
        where: {
          id: employeeId1,
        },
        data: {
          position: {
            connect: {
              id: positionId1,
            },
          },
        },
      });
    });

    it('successfully retrieves an employee by id', async () => {
      const employee = await service.findOne(employeeId1);
      expect(employee.firstName).toBe('John');
      expect(employee.lastName).toBe('Doe');
      expect(employee.positionId).toBe(positionId1);
      expect(employee.position?.departmentId).toBe(departmentId);
    });

    it('throws if the employee does not exist', async () => {
      await expect(service.findOne('non-existent-id')).rejects.toThrow();
    });
  });

  describe('findOneByRefreshToken', () => {
    beforeEach(async () => {
      const employeeDto1: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        scope: $Enums.EmployeeScope.ADMIN,
        positionId: positionId1,
        accessToken: '123456',
      };
      employeeId1 = (await service.create(employeeDto1)).id;
      await module.get<PrismaService>(PrismaService).employee.update({
        where: {
          id: employeeId1,
        },
        data: {
          position: {
            connect: {
              id: positionId1,
            },
          },
        },
      });
      await service.setRefreshToken(employeeId1, 'token');
    });

    it('successfully retrieves an employee by id and refresh token', async () => {
      const employee = await service.findOneWithRefresh(employeeId1, 'token');
      expect(employee.firstName).toBe('John');
      expect(employee.lastName).toBe('Doe');
      expect(employee.position?.departmentId).toBe(departmentId);
    });

    it('throws if the token is not valid', async () => {
      await expect(
        service.findOneWithRefresh(employeeId1, 'invalid-token'),
      ).rejects.toThrow();
    });
  });

  describe('findOneByEmail', () => {
    beforeEach(async () => {
      const employeeDto1: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        scope: $Enums.EmployeeScope.ADMIN,
        positionId: positionId1,
        accessToken: '123456',
      };
      employeeId1 = (await service.create(employeeDto1)).id;
      await module.get<PrismaService>(PrismaService).employee.update({
        where: {
          id: employeeId1,
        },
        data: {
          position: {
            connect: {
              id: positionId1,
            },
          },
        },
      });
    });

    it('successfully retrieves an employee by email', async () => {
      const employee = await service.findOneByEmail('john.doe@example.com');
      expect(employee.firstName).toBe('John');
      expect(employee.lastName).toBe('Doe');
      expect(employee.positionId).toBe(positionId1);
      expect(employee.position?.departmentId).toBe(departmentId);
    });

    it('throws if the token is not valid', async () => {
      await expect(
        service.findOneByEmail('jane.smith@example.com'),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    beforeEach(async () => {
      const employeeDto1: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        scope: $Enums.EmployeeScope.ADMIN,
        positionId: positionId1,
        accessToken: '123456',
      };
      employeeId1 = (await service.create(employeeDto1)).id;
    });

    it('removes an employee by id', async () => {
      await service.remove(employeeId1);
      await expect(service.findOne(employeeId1)).rejects.toThrow();
    });
  });
});
