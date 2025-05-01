import { Test, TestingModule } from '@nestjs/testing';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  PositionBaseEntity,
  PositionEntityEmployeeHydrated,
} from './entities/position.entity';
import { CreatePositionDto } from './dto/create-position.dto';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LoggerServiceImpl } from '../logger/logger.service';

describe('PositionsController', () => {
  let controller: PositionsController;
  let positionsService: PositionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionsController],
      providers: [PositionsService, PrismaService, LoggerServiceImpl],
    }).compile();

    controller = module.get<PositionsController>(PositionsController);
    positionsService = module.get<PositionsService>(PositionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of positions', async () => {
      const result = [
        {
          id: 'position-id-1',
          name: 'position-name',
          department: {
            id: 'department-id',
            name: 'department-name',
          },
          employees: [
            {
              id: 'employee-id',
              firstName: 'employee-first-name',
              lastName: 'employee-last-name',
              email: 'employee-email',
            },
          ],
        },
        {
          id: 'position-id-2',
          name: 'position-name',
          department: {
            id: 'department-id-2',
            name: 'department-name-2',
          },
          employees: [],
        },
      ];

      const expected = [
        new PositionEntityEmployeeHydrated({
          id: 'position-id-1',
          name: 'position-name',
          department: {
            id: 'department-id',
            name: 'department-name',
          },
          employees: [
            {
              id: 'employee-id',
              firstName: 'employee-first-name',
              lastName: 'employee-last-name',
              email: 'employee-email',
            },
          ],
        }),
        new PositionEntityEmployeeHydrated({
          id: 'position-id-2',
          name: 'position-name',
          department: {
            id: 'department-id-2',
            name: 'department-name-2',
          },
          employees: [],
        }),
      ];

      jest
        .spyOn(positionsService, 'findAll')
        .mockImplementation(async () => result);

      expect(await controller.findAll(10)).toEqual(expected);
    });
  });

  describe('create', () => {
    it('should create a new Position', async () => {
      const createPositionDto: CreatePositionDto = {
        name: 'New Position',
        departmentId: '3f08fe46-a243-4b33-84fa-6702a74f3a5d',
      };

      const createdPosition = {
        id: 'new-Position-id',
        name: 'New Position',
        departmentId: '3f08fe46-a243-4b33-84fa-6702a74f3a5d',
        employees: [],
        single: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(positionsService, 'create')
        .mockImplementation(async () => createdPosition);

      const result = await controller.create(createPositionDto);
      const expected = new PositionBaseEntity(createdPosition);
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should find a Position by ID', async () => {
      const positionId = 'valid-Position-id';
      const position = {
        id: positionId,
        name: 'Position Name',
        single: false,
        departmentId: '3f08fe46-a243-4b33-84fa-6702a74f3a5d',
        employees: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(positionsService, 'findOne').mockImplementation(async (id) => {
        if (id === positionId) {
          return position;
        }
        throw new Prisma.PrismaClientKnownRequestError('Position not found', {
          code: 'P2025',
          clientVersion: '',
          meta: undefined,
          batchRequestIdx: undefined,
        });
      });

      const result = await controller.findOne(positionId);
      const expected = new PositionBaseEntity(position);
      expect(result).toEqual(expected);
    });

    it('should raise a NotFoundException if position is not found', async () => {
      const invalidPositionId = 'invalid-position-id';

      jest.spyOn(positionsService, 'findOne').mockImplementation(async (id) => {
        if (id === invalidPositionId) {
          throw new Prisma.PrismaClientKnownRequestError('Position not found', {
            code: 'P2025',
            clientVersion: '',
            meta: undefined,
            batchRequestIdx: undefined,
          });
        }
        return {
          id: 'id',
          name: 'Position Name',
          single: false,
          departmentId: '3f08fe46-a243-4b33-84fa-6702a74f3a5d',
          employees: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      await expect(controller.findOne(invalidPositionId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('update', () => {});

  describe('remove', () => {
    it('should delete a position with id', async () => {
      const positionId = 'valid-Position-id';

      jest.spyOn(positionsService, 'remove').mockImplementation(async () => {});

      expect(await controller.remove(positionId)).toEqual(undefined);
    });

    it('should raise an error if not found', async () => {
      const positionId = '3f08fe46-a243-4b33-84fa-6702a74f3a5d';

      jest.spyOn(positionsService, 'remove').mockImplementation(async () => {
        throw new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2025',
          clientVersion: '',
          meta: undefined,
          batchRequestIdx: undefined,
        });
      });

      expect(controller.remove(positionId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
