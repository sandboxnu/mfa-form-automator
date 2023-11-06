import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService],
  imports: [PrismaModule],
  exports: [PositionsService],
})
export class PositionsModule {}
