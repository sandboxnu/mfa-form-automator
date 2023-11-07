import { Test, TestingModule } from '@nestjs/testing';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { PrismaService } from '../prisma/prisma.service';
import { PositionEntity } from './entities/position.entity';
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
          id: '3f08fe46-a243-4b33-84fa-6702a74f3a5d',
          name: 'position-name',
          single: false,
          departmentId: '3f08fe46-a243-4b33-84fa-6702a74f3a5d',
          createdAt: new Date(1672531200),
          updatedAt: new Date(1672531200),
        },
        {
          id: 'position-id-2',
          name: 'position-name',
          single: false,
          departmentId: '3f08fe46-a243-4b33-84fa-6702a74f3a5d',
          createdAt: new Date(1672531200),
          updatedAt: new Date(1672531200),
        },
      ];

      const expected = [
        new PositionEntity({
          id: '3f08fe46-a243-4b33-84fa-6702a74f3a5d',
          name: 'position-name',
          single: false,
          departmentId: '3f08fe46-a243-4b33-84fa-6702a74f3a5d',
          createdAt: new Date(1672531200),
          updatedAt: new Date(1672531200),
        }),
        new PositionEntity({
          id: 'position-id-2',
          name: 'position-name',
          single: false,
          departmentId: '3f08fe46-a243-4b33-84fa-6702a74f3a5d',
          createdAt: new Date(1672531200),
          updatedAt: new Date(1672531200),
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
        single: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(positionsService, 'create')
        .mockImplementation(async () => createdPosition);

      const result = await controller.create(createPositionDto);
      const expected = new PositionEntity(createdPosition);
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(positionsService, 'findOne').mockImplementation(async (id) => {
        if (id === positionId) {
          return position as any;
        }
        return null as any;
      });

      const result = await controller.findOne(positionId);
      const expected = new PositionEntity(position);
      expect(result).toEqual(expected);
    });

    it('should raise a NotFoundException if position is not found', async () => {
      const invalidPositionId = 'invalid-position-id';

      jest.spyOn(positionsService, 'findOne').mockImplementation(async (id) => {
        if (id === invalidPositionId) {
          return null as any;
        }
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
