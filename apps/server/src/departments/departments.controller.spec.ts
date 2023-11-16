import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { PrismaService } from '../prisma/prisma.service';
import { DepartmentEntity } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LoggerServiceImpl } from '../logger/logger.service';

describe('DepartmentsController', () => {
  let controller: DepartmentsController;
  let departmentsService: DepartmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentsController],
      providers: [DepartmentsService, PrismaService, LoggerServiceImpl],
    }).compile();

    controller = module.get<DepartmentsController>(DepartmentsController);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of departments', async () => {
      const result = [
        {
          id: 'department-id',
          name: 'department-name',
          createdAt: new Date(1672531200),
          updatedAt: new Date(1672531200),
        },
        {
          id: 'department-id-one',
          name: 'department-name-one',
          createdAt: new Date(1672531201),
          updatedAt: new Date(1672531201),
        },
      ];

      const expected = [
        new DepartmentEntity({
          id: 'department-id',
          name: 'department-name',
          createdAt: new Date(1672531200),
          updatedAt: new Date(1672531200),
        }),
        new DepartmentEntity({
          id: 'department-id-one',
          name: 'department-name-one',
          createdAt: new Date(1672531201),
          updatedAt: new Date(1672531201),
        }),
      ];

      jest
        .spyOn(departmentsService, 'findAll')
        .mockImplementation(async () => result);

      expect(await controller.findAll(10)).toEqual(expected);
    });
  });

  describe('create', () => {
    it('should create a new department', async () => {
      const createDepartmentDto: CreateDepartmentDto = {
        name: 'New Department',
      };

      const createdDepartment = {
        id: 'new-department-id',
        name: 'New Department',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(departmentsService, 'create')
        .mockImplementation(async () => createdDepartment);

      const result = await controller.create(createDepartmentDto);
      const expected = new DepartmentEntity(createdDepartment);
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should find a department by ID', async () => {
      const departmentId = 'valid-department-id';
      const department = {
        id: departmentId,
        name: 'Department Name',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(departmentsService, 'findOne')
        .mockImplementation(async (id) => {
          if (id === departmentId) {
            return department as any;
          }
          return null as any;
        });

      const result = await controller.findOne(departmentId);
      const expected = new DepartmentEntity(department);
      expect(result).toEqual(expected);
    });

    it('should raise a NotFoundException if department is not found', async () => {
      const invalidDepartmentId = 'invalid-department-id';

      jest
        .spyOn(departmentsService, 'findOne')
        .mockImplementation(async (id) => {
          if (id === invalidDepartmentId) {
            return null as any; // Cast to the expected type.
          }
          // Handle other IDs if needed.
        });

      await expect(
        controller.findOne(invalidDepartmentId),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update', () => {});

  describe('remove', () => {
    it('should delete a department with id', async () => {
      const departmentId = '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f';

      jest
        .spyOn(departmentsService, 'remove')
        .mockImplementation(async () => {});

      expect(await controller.remove(departmentId)).toEqual(undefined);
    });

    it('should raise an error if not found', async () => {
      const departmentId = '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f';

      jest.spyOn(departmentsService, 'remove').mockImplementation(async () => {
        throw new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2025',
          clientVersion: '',
          meta: undefined,
          batchRequestIdx: undefined,
        });
      });

      expect(controller.remove(departmentId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
