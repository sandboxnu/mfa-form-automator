import { Test, TestingModule } from '@nestjs/testing';
import { PositionsService } from './positions.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

describe('PositionsService', () => {
  let service: PositionsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PositionsService, PrismaService],
    }).compile();

    service = module.get<PositionsService>(PositionsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new department', async () => {
      const createPositionDto: CreatePositionDto = {
        name: 'New Position',
        departmentId: '3f08fe46-a243-4b33-84fa-6702a74f3a5d', 
      };

      const createdPosition = {
        id: '1',
        single: false, 
        departmentId: '3f08fe46-a243-4b33-84fa-6702a74f3a5d',
        name: 'Test Positions',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.position, 'create')
        .mockResolvedValue(createdPosition);
      const result = await service.create(createPositionDto);
      expect(result).toEqual(createdPosition);
    });
  });

  describe('findAll', () => {
    it('should retrieve all departments', async () => {
      const positions = [
        {
          id: '1',
          name: 'Position 1',
          single: false, 
          departmentId: '3f08fe46-a243-4b33-84fa-6702a74f3a5d',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Position 2',
          single: false, 
          departmentId: '3f08fe46-a243-4b33-84fa-6702a74f3a5d',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest
        .spyOn(prismaService.position, 'findMany')
        .mockResolvedValue(positions);
      const result = await service.findAll();
      expect(result).toEqual(positions);
    });
  });

  describe('findOne', () => {
    it('should retrieve a position by ID', async () => {
      const positionId = '1';
      const position = {
        id: positionId,
        name: 'Test Position',
        single: false, 
        departmentId: '3f08fe46-a243-4b33-84fa-6702a74f3a5d',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.position, 'findFirstOrThrow')
        .mockResolvedValue(position);
      const result = await service.findOne(positionId);
      expect(result).toEqual(position);
    });

    it('should throw an error if position not found', async () => {
      const positionId = 'nonexistent';
      jest
        .spyOn(prismaService.position, 'findFirstOrThrow')
        .mockRejectedValue(new Error('Position not found'));
      await expect(service.findOne(positionId)).rejects.toThrowError(
        'Position not found',
      );
    });
  });

  describe('update', () => {
    it('should update a Position', async () => {
      const positionId = '1';
      const UpdatePositionDto: UpdatePositionDto = {
        name: 'Updated Position',
      };

      const updatedPosition = {
        id: positionId,
        name: 'Updated Position',
        single: false, 
        departmentId: '3f08fe46-a243-4b33-84fa-6702a74f3a5d',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.position, 'update')
        .mockResolvedValue(updatedPosition);
      const result = await service.update(positionId, UpdatePositionDto);
      expect(result).toEqual(updatedPosition);
    });
  });

  describe('remove', () => {
    it('should remove a position', async () => {
      const positionId = '1';
      const updatedPosition = {
        id: '1',
        name: 'Updated Position',
        single: false, 
        departmentId: '3f08fe46-a243-4b33-84fa-6702a74f3a5d',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.position, 'delete')
        .mockResolvedValue(updatedPosition);

      await service.remove(positionId);

      expect(prismaService.position.delete).toHaveBeenCalledWith({
        where: { id: positionId },
      });
    });
  });
});
