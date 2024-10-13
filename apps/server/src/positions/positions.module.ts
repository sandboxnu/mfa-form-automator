import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';
import { DepartmentsModule } from '@server/departments/departments.module';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService],
  imports: [PrismaModule, LoggerModule, DepartmentsModule],
  exports: [PositionsService],
})
export class PositionsModule {}
