import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '@prisma/client';
import { DepartmentEntity } from './../../departments/entities/department.entity';
import { Exclude } from 'class-transformer';

export class EmployeeEntity implements Employee {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @Exclude()
  departmentId: string;

  @ApiProperty()
  department: DepartmentEntity;

  @ApiProperty()
  email: string;

  @Exclude()
  pswdHash: string | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<EmployeeEntity>) {
    if (partial.department) {
      partial.department = new DepartmentEntity(partial.department);
    }
    Object.assign(this, partial);
  }
}
