import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  imports: [PrismaModule],
})
export class DepartmentsModule {}
