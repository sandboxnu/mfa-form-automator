import { TestingModule, Test } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { PrismaService } from '../prisma/prisma.service';
import { PositionsService } from '../positions/positions.service';
import { DepartmentsService } from '../departments/departments.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { $Enums } from '@prisma/client';
import { ValidateEmployeeHandler } from './validate-employee/ValidateEmployeeHandlerInterface';
import { MockValidateEmployeeHandler } from './validate-employee/MockValidateEmployeeHandler';
import { EmployeeErrorMessage } from './employees.errors';
import { SortOption } from '../utils';

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

    describe('create', () => {
      it('successfully creates a new employee', async () => {
        const employeeDto: CreateEmployeeDto = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
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
      });

      it('throws an error when creating an employee with a duplicate email', async () => {
        // First, create an employee
        const employeeDto: CreateEmployeeDto = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'duplicate@example.com',
          scope: $Enums.EmployeeScope.ADMIN,
          positionId: positionId1,
          accessToken: '123456',
        };

        await service.create(employeeDto);

        // Then, try to create another employee with the same email
        const duplicateEmployeeDto: CreateEmployeeDto = {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'duplicate@example.com', // Same email as the first employee
          scope: $Enums.EmployeeScope.BASE_USER,
          positionId: positionId2,
          accessToken: '789012',
        };

        // The second creation should fail with a specific error
        await expect(service.create(duplicateEmployeeDto)).rejects.toThrow(
          EmployeeErrorMessage.EMPLOYEE_EMAIL_ALREADY_EXISTS,
        );
      });
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      const employeeDto1: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
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
      expect(updatedEmployee.position?.department?.id).toBe(departmentId);
      expect(updatedEmployee.signatureLink).toBe('new signature link');
    });
  });

  describe('setRefreshToken', () => {
    beforeEach(async () => {
      const employeeDto1: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
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
        scope: $Enums.EmployeeScope.ADMIN,
        positionId: positionId1,
        accessToken: '123456',
      };
      const employeeDto2: CreateEmployeeDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
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
      const employees = await service.findAll({});
      expect(employees).toHaveLength(2);
    });
    it('successfully retrieves a limited number of employees', async () => {
      const employees = await service.findAll({ limit: 1 });
      expect(employees).toHaveLength(1);
    });
  });

  describe('findAllSecure', () => {
    beforeEach(async () => {
      const employeeDto1: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        scope: $Enums.EmployeeScope.ADMIN,
        positionId: positionId1,
        accessToken: '123456',
      };
      const employeeDto2: CreateEmployeeDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        scope: $Enums.EmployeeScope.ADMIN,
        positionId: positionId2,
        accessToken: '123456',
      };
      employeeId1 = (await service.create(employeeDto1)).id;
      await new Promise((resolve) => setTimeout(resolve, 10));
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

    it('successfully retrieves all employees with secure data', async () => {
      const employees = await service.findAllSecure({});
      expect(employees).toHaveLength(2);
      expect(employees[0].id).toBe(employeeId2);
      expect(employees[1].id).toBe(employeeId1);
      expect(employees[0].position?.department?.id).toBe(departmentId);
      expect(employees[1].position?.department?.id).toBe(departmentId);
      expect(employees[0].scope).toBe($Enums.EmployeeScope.ADMIN);
      expect(employees[1].scope).toBe($Enums.EmployeeScope.ADMIN);
    });
  });

  describe('sorting with findAll', () => {
    beforeEach(async () => {
      const employeeDto1: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        scope: $Enums.EmployeeScope.ADMIN,
        positionId: positionId1,
        accessToken: '123456',
      };
      const employeeDto2: CreateEmployeeDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        scope: $Enums.EmployeeScope.ADMIN,
        positionId: positionId2,
        accessToken: '123456',
      };
      employeeId1 = (await service.create(employeeDto1)).id;
      await new Promise((resolve) => setTimeout(resolve, 10));
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

    it('sorts by name in ascending order', async () => {
      const employees = await service.findAll({
        sortBy: SortOption.NAME_ASC,
      });

      expect(employees).toHaveLength(2);
      expect(employees[0].firstName).toBe('Jane');
      expect(employees[1].firstName).toBe('John');
    });

    it('sorts by name in descending order', async () => {
      const employees = await service.findAll({
        sortBy: SortOption.NAME_DESC,
      });

      expect(employees).toHaveLength(2);
      expect(employees[0].firstName).toBe('John');
      expect(employees[1].firstName).toBe('Jane');
    });
  });

  describe('sorting with findAllSecure', () => {
    beforeEach(async () => {
      const employeeDto1: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        scope: $Enums.EmployeeScope.ADMIN,
        positionId: positionId1,
        accessToken: '123456',
      };
      const employeeDto2: CreateEmployeeDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        scope: $Enums.EmployeeScope.ADMIN,
        positionId: positionId2,
        accessToken: '123456',
      };
      employeeId1 = (await service.create(employeeDto1)).id;
      await new Promise((resolve) => setTimeout(resolve, 10));
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

    it('sorts by name in ascending order in secure mode', async () => {
      const employees = await service.findAllSecure({
        sortBy: SortOption.NAME_ASC,
      });

      expect(employees).toHaveLength(2);
      expect(employees[0].firstName).toBe('Jane');
      expect(employees[1].firstName).toBe('John');

      // Verify we have secure data
      expect(employees[0].position?.department).toBeDefined();
      expect(employees[0].scope).toBeDefined();
    });

    it('sorts by name in descending order in secure mode', async () => {
      const employees = await service.findAllSecure({
        sortBy: SortOption.NAME_DESC,
      });

      expect(employees).toHaveLength(2);
      expect(employees[0].firstName).toBe('John');
      expect(employees[1].firstName).toBe('Jane');

      // Verify we have secure data
      expect(employees[0].position?.department).toBeDefined();
      expect(employees[0].scope).toBeDefined();
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      const employeeDto1: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
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
      expect(employee.position?.department?.id).toBe(departmentId);
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
      expect(employee.position?.department?.id).toBe(departmentId);
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
      const employee = await service.findOneByEmailAuth('john.doe@example.com');
      expect(employee.firstName).toBe('John');
      expect(employee.lastName).toBe('Doe');
      expect(employee.position?.id).toBe(positionId1);
      expect(employee.position?.department?.id).toBe(departmentId);
    });

    it('throws if the token is not valid', async () => {
      await expect(
        service.findOneByEmailAuth('jane.smith@example.com'),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    beforeEach(async () => {
      const employeeDto1: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
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
