import { ApiProperty } from '@nestjs/swagger';
import { Position } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { SignatureFieldEntity } from './../../signature-fields/entities/signature-field.entity';
import { Optional } from '@nestjs/common';
import { DepartmentEntity } from '@server/departments/entities/department.entity';

export class PositionEntity implements Position {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  single: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  @Optional()
  departmentId: string;

  @Optional()
  @ApiProperty()
  department: DepartmentEntity;

  @ApiProperty()
  signatureFields: SignatureFieldEntity[];

  constructor(partial: Partial<PositionEntity>) {
    if (partial.department) {
      partial.department = new DepartmentEntity(partial.department);
    }
    Object.assign(this, partial);
  }
}
