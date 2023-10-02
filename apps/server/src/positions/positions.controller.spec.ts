import { Test, TestingModule } from '@nestjs/testing';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PositionsController', () => {
  let controller: PositionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionsController],
      providers: [PositionsService, PrismaService],
    }).compile();

    controller = module.get<PositionsController>(PositionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
