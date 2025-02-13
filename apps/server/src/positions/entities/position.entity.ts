import { ApiProperty } from '@nestjs/swagger';
import { Position } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { DepartmentEntity } from './../../departments/entities/department.entity';
import { IsOptional } from 'class-validator';
import { EmployeeBaseEntity } from '../../employees/entities/employee.entity';

export class PositionBaseEntity implements Position {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  single: boolean;

  @Exclude()
  @IsOptional()
  departmentId: string;

  @IsOptional()
  @ApiProperty()
  department: DepartmentEntity;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<PositionBaseEntity>) {
    if (partial.department) {
      partial.department = new DepartmentEntity(partial.department);
    }
    Object.assign(this, partial);
  }
}

export class PositionEntity extends PositionBaseEntity {
  @ApiProperty({
    type: EmployeeBaseEntity,
  })
  employees: EmployeeBaseEntity[];

  constructor(partial: Partial<PositionEntity>) {
    super(partial);
    if (partial.employees) {
      partial.employees = partial.employees.map(
        (employee) => new EmployeeBaseEntity(employee),
      );
    }
    Object.assign(this, partial);
  }
}
