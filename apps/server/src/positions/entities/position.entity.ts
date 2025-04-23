import { ApiProperty } from '@nestjs/swagger';
import { Position } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { DepartmentBaseEntity } from './../../departments/entities/department.entity';
import { IsOptional } from 'class-validator';
import { EmployeeBaseEntity } from '../../employees/entities/employee.entity';

export class PositionBaseEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  department: DepartmentBaseEntity;

  constructor(partial: Partial<PositionBaseEntity>) {
    if (partial.department) {
      partial.department = new DepartmentBaseEntity(partial.department);
    }
    Object.assign(this, partial);
  }
}

export class PositionEntity implements Position {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  single: boolean;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  departmentId: string;

  @IsOptional()
  @ApiProperty()
  department: DepartmentBaseEntity;

  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  constructor(partial: Partial<PositionEntity>) {
    if (partial.department) {
      partial.department = new DepartmentBaseEntity(partial.department);
    }
    Object.assign(this, partial);
  }
}

export class PositionEntitHydrated extends PositionEntity {
  @ApiProperty({
    type: EmployeeBaseEntity,
  })
  employees: EmployeeBaseEntity[];

  constructor(partial: Partial<PositionEntitHydrated>) {
    super(partial);
    if (partial.employees) {
      partial.employees = partial.employees.map(
        (employee) => new EmployeeBaseEntity(employee),
      );
    }
    Object.assign(this, partial);
  }
}
