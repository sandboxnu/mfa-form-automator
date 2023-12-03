import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  imports: [PrismaModule, LoggerModule],
})
export class DepartmentsModule {}
