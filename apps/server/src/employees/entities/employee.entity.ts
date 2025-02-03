import { ApiProperty } from '@nestjs/swagger';
import { Employee, EmployeeScope } from '@prisma/client';
import { PositionBaseEntity } from './../../positions/entities/position.entity';
import { Exclude } from 'class-transformer';

export class EmployeeBaseEntity implements Employee {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @Exclude()
  positionId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  signatureLink: string;

  @ApiProperty()
  scope: EmployeeScope;

  @Exclude()
  pswdHash: string | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  refreshToken: string | null;

  constructor(partial: Partial<EmployeeBaseEntity>) {
    Object.assign(this, partial);
  }
}

export class EmployeeEntity extends EmployeeBaseEntity {
  @ApiProperty()
  position: PositionBaseEntity;

  constructor(partial: Partial<EmployeeEntity>) {
    super(partial);
    if (partial.position) {
      partial.position = new PositionBaseEntity(partial.position);
    }
    Object.assign(this, partial);
  }
}
