import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { PositionsService } from './positions.service';
import { SortOption } from '../utils';

describe('PositionsServiceIntegrationTest', () => {
  let module: TestingModule;
  let positionsService: PositionsService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [PositionsService, PrismaService],
    }).compile();
    positionsService = module.get<PositionsService>(PositionsService);
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

  describe('sorting', () => {
    beforeEach(async () => {
      // Create departments for positions
      const department = await module
        .get<PrismaService>(PrismaService)
        .department.create({
          data: { name: 'Department' },
        });

      // Create positions with different names to test sorting
      for (let i = 1; i <= 10; i++) {
        await positionsService.create({
          name: `Position ${i}`,
          departmentId: department.id,
        });
      }
    });

    it('sorts by name in ascending order', async () => {
      const positions = await positionsService.findAll({
        sortBy: SortOption.NAME_ASC,
      });

      expect(positions).toHaveLength(10);
      expect(positions[0].name).toBe('Position 1');
      expect(positions[1].name).toBe('Position 10');
    });

    it('sorts by name in descending order', async () => {
      const positions = await positionsService.findAll({
        sortBy: SortOption.NAME_DESC,
      });

      expect(positions).toHaveLength(10);
      expect(positions[0].name).toBe('Position 9');
      expect(positions[1].name).toBe('Position 8');
    });
  });
});
