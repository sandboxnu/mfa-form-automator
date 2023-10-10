import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsService } from './departments.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartmentsService, PrismaService],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new department', async () => {
      const createDepartmentDto: CreateDepartmentDto = {
        name: 'Test Department',
        signatureFields: [],
      };

      const createdDepartment = {
        id: '1',
        name: 'Test Department',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.department, 'create')
        .mockResolvedValue(createdDepartment);
      const result = await service.create(createDepartmentDto);
      expect(result).toEqual(createdDepartment);
    });
  });

  describe('findAll', () => {
    it('should retrieve all departments', async () => {
      const departments = [
        {
          id: '1',
          name: 'Department 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Department 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest
        .spyOn(prismaService.department, 'findMany')
        .mockResolvedValue(departments);
      const result = await service.findAll();
      expect(result).toEqual(departments);
    });
  });

  describe('findOne', () => {
    it('should retrieve a department by ID', async () => {
      const departmentId = '1';
      const department = {
        id: departmentId,
        name: 'Test Department',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.department, 'findFirstOrThrow')
        .mockResolvedValue(department);
      const result = await service.findOne(departmentId);
      expect(result).toEqual(department);
    });

    it('should throw an error if department not found', async () => {
      const departmentId = 'nonexistent';
      jest
        .spyOn(prismaService.department, 'findFirstOrThrow')
        .mockRejectedValue(new Error('Department not found'));
      await expect(service.findOne(departmentId)).rejects.toThrowError(
        'Department not found',
      );
    });
  });

  describe('update', () => {
    it('should update a department', async () => {
      const departmentId = '1';
      const updateDepartmentDto: UpdateDepartmentDto = {
        name: 'Updated Department',
      };

      const updatedDepartment = {
        id: departmentId,
        name: 'Updated Department',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.department, 'update')
        .mockResolvedValue(updatedDepartment);
      const result = await service.update(departmentId, updateDepartmentDto);
      expect(result).toEqual(updatedDepartment);
    });
  });

  describe('remove', () => {
    it('should remove a department', async () => {
      const departmentId = '1';
      const updatedDepartment = {
        id: '1',
        name: 'Updated Department',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.department, 'delete')
        .mockResolvedValue(updatedDepartment);

      await service.remove(departmentId);

      expect(prismaService.department.delete).toHaveBeenCalledWith({
        where: { id: departmentId },
      });
    });
  });
});
