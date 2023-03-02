import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../models/department.entity';
import { DepartmentService } from './department.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  exports: [DepartmentService],
  providers: [DepartmentService],
  controllers: [],
})
export class DepartmentModule {}
