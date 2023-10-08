import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { PrismaService } from '../prisma/prisma.service';
import { DepartmentEntity } from './entities/department.entity';

describe('DepartmentsController', () => {
  let controller: DepartmentsController;
  let departmentsService: DepartmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentsController],
      providers: [DepartmentsService, PrismaService],
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
});
