import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService],
  imports: [PrismaModule, LoggerModule],
  exports: [PositionsService],
})
export class PositionsModule {}
