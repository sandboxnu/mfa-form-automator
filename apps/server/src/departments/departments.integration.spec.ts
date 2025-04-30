import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { DepartmentsService } from './departments.service';
import { SortOption } from '../utils';

describe('DepartmentServiceIntegrationTest', () => {
  let module: TestingModule;
  let departmentsService: DepartmentsService;

  let departmentId: string;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [DepartmentsService, PrismaService],
    }).compile();
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
  });

  beforeEach(async () => {
    // We need to seed the database with some data
    await module
      .get<PrismaService>(PrismaService)
      .$transaction([
        module.get<PrismaService>(PrismaService).instanceBox.deleteMany(),
        module.get<PrismaService>(PrismaService).assignedGroup.deleteMany(),
        module.get<PrismaService>(PrismaService).formInstance.deleteMany(),
        module.get<PrismaService>(PrismaService).employee.deleteMany(),
        module.get<PrismaService>(PrismaService).position.deleteMany(),
        module.get<PrismaService>(PrismaService).department.deleteMany(),
      ]);
  });

  describe('create', () => {
    it('should create a new department', async () => {
      const department = await departmentsService.create({
        name: 'HR',
      });
      expect(department.id).toBeDefined();
      expect(department.name).toEqual('HR');
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      await departmentsService.create({
        name: 'HR',
      });
      await new Promise((resolve) => setTimeout(resolve, 10));
      await departmentsService.create({
        name: 'Engineering',
      });
    });

    it('should retrieve all departments', async () => {
      const departments = await departmentsService.findAll({});
      expect(departments.length).toEqual(2);
      expect(departments[0].name).toEqual('HR');
      expect(departments[1].name).toEqual('Engineering');
    });
  });

  describe('sorting', () => {
    beforeEach(async () => {
      // Create departments with different names and timestamps to test sorting
      for (let i = 1; i <= 10; i++) {
        await departmentsService.create({
          name: `Department ${i}`,
        });

        // Add small delay to ensure different createdAt timestamps
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    });

    it('sorts by name in ascending order', async () => {
      const departments = await departmentsService.findAll({
        sortBy: SortOption.NAME_ASC,
      });

      expect(departments).toHaveLength(10);
      expect(departments[0].name).toBe('Department 1');
      expect(departments[1].name).toBe('Department 10');
    });

    it('sorts by name in descending order', async () => {
      const departments = await departmentsService.findAll({
        sortBy: SortOption.NAME_DESC,
      });

      expect(departments).toHaveLength(10);
      expect(departments[0].name).toBe('Department 9');
      expect(departments[1].name).toBe('Department 8');
    });

    it('sorts by creation date in ascending order', async () => {
      const departments = await departmentsService.findAll({
        sortBy: SortOption.CREATED_AT_ASC,
      });

      expect(departments).toHaveLength(10);
      expect(departments[0].createdAt.getUTCSeconds()).toBeLessThanOrEqual(
        departments[1].createdAt.getUTCSeconds(),
      );
      expect(departments[1].createdAt.getUTCSeconds()).toBeLessThanOrEqual(
        departments[2].createdAt.getUTCSeconds(),
      );
    });

    it('sorts by creation date in descending order', async () => {
      const departments = await departmentsService.findAll({
        sortBy: SortOption.CREATED_AT_DESC,
      });

      expect(departments).toHaveLength(10);
      expect(departments[0].createdAt.getUTCSeconds()).toBeGreaterThanOrEqual(
        departments[1].createdAt.getUTCSeconds(),
      );
      expect(departments[1].createdAt.getUTCSeconds()).toBeGreaterThanOrEqual(
        departments[2].createdAt.getUTCSeconds(),
      );
    });

    it('sorts by updated date in ascending order', async () => {
      const departments = await departmentsService.findAll({
        sortBy: SortOption.UPDATED_AT_ASC,
      });

      expect(departments).toHaveLength(10);
      expect(departments[0].updatedAt.getUTCSeconds()).toBeLessThanOrEqual(
        departments[1].updatedAt.getUTCSeconds(),
      );
      expect(departments[1].updatedAt.getUTCSeconds()).toBeLessThanOrEqual(
        departments[2].updatedAt.getUTCSeconds(),
      );
    });

    it('sorts by updated date in descending order', async () => {
      const departments = await departmentsService.findAll({
        sortBy: SortOption.UPDATED_AT_DESC,
      });

      expect(departments).toHaveLength(10);
      expect(departments[0].updatedAt.getUTCSeconds()).toBeGreaterThanOrEqual(
        departments[1].updatedAt.getUTCSeconds(),
      );
      expect(departments[1].updatedAt.getUTCSeconds()).toBeGreaterThanOrEqual(
        departments[2].updatedAt.getUTCSeconds(),
      );
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      const department = await departmentsService.create({
        name: 'HR',
      });
      departmentId = department.id;
    });

    it('should retrieve a department by id', async () => {
      const department = await departmentsService.findOne(departmentId);
      expect(department.name).toEqual('HR');
    });

    it('should throw an error if the department does not exist', async () => {
      await expect(
        departmentsService.findOne('non-existent-id'),
      ).rejects.toThrow();
    });
  });

  describe('findOneOrCreateByName', () => {
    beforeEach(() => {});

    it('should create a department if it does not exist', async () => {
      const department = await departmentsService.findOrCreateOneByName('HR');
      expect(department.name).toEqual('HR');
    });

    it('should retrieve a department if it exists', async () => {
      await departmentsService.create({
        name: 'HR',
      });
      const department = await departmentsService.findOrCreateOneByName('HR');
      expect(department.name).toEqual('HR');
    });
  });

  describe('findOneByName', () => {
    beforeEach(async () => {
      await departmentsService.create({
        name: 'HR',
      });
    });

    it('should retrieve a department by name', async () => {
      const department = await departmentsService.findOneByName('HR');
      expect(department.name).toEqual('HR');
    });

    it('should throw an error if the department does not exist', async () => {
      await expect(
        departmentsService.findOneByName('non-existent-name'),
      ).rejects.toThrow();
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      const department = await departmentsService.create({
        name: 'HR',
      });
      departmentId = department.id;
    });

    it('should update a department', async () => {
      const updatedDepartment = await departmentsService.update(departmentId, {
        name: 'Engineering',
      });
      expect(updatedDepartment.name).toEqual('Engineering');
    });

    it('should throw an error if the department does not exist', async () => {
      await expect(
        departmentsService.update('non-existent-id', {
          name: 'Engineering',
        }),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    beforeEach(async () => {
      const department = await departmentsService.create({
        name: 'HR',
      });
      departmentId = department.id;
    });

    it('should remove a department', async () => {
      await departmentsService.remove(departmentId);
      await expect(departmentsService.findOne(departmentId)).rejects.toThrow();
    });

    it('should throw an error if the department does not exist', async () => {
      await expect(
        departmentsService.remove('non-existent-id'),
      ).rejects.toThrow();
    });
  });
});
