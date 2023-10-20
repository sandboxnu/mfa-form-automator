import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '@prisma/client';
import { PositionEntity } from './../../positions/entities/position.entity';
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

  @Exclude()
  pswdHash: string | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<EmployeeBaseEntity>) {
    Object.assign(this, partial);
  }
}

export class EmployeeEntity extends EmployeeBaseEntity {
  @ApiProperty()
  position: PositionEntity;

  constructor(partial: Partial<EmployeeEntity>) {
    super(partial);
    if (partial.position) {
      partial.position = new PositionEntity(partial.position);
    }
    Object.assign(this, partial);
  }
}
