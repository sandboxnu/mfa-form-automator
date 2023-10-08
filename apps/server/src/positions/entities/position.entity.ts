import { ApiProperty } from '@nestjs/swagger';
import { Position } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { SignatureFieldEntity } from './../../signature-fields/entities/signature-field.entity';
import { DepartmentEntity } from './../../departments/entities/department.entity';
import { IsOptional } from 'class-validator';
import { SignatureEntity } from './../../signatures/entities/signature.entity';
import { EmployeeEntity } from './../../employees/entities/employee.entity';

export class PositionEntity implements Position {
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

  @ApiProperty()
  signatureFields: SignatureFieldEntity[];

  @ApiProperty()
  signatures: SignatureEntity[];

  @ApiProperty()
  employees: EmployeeEntity[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<PositionEntity>) {
    if (partial.department) {
      partial.department = new DepartmentEntity(partial.department);
    }
    Object.assign(this, partial);
  }
}
