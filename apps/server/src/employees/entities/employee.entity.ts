import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '@prisma/client';
import { PositionEntity } from './../../positions/entities/position.entity';
import { Exclude } from 'class-transformer';

export class EmployeeEntity implements Employee {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @Exclude()
  positionId: string;

  @ApiProperty()
  position: PositionEntity;

  @ApiProperty()
  email: string;

  @Exclude()
  pswdHash: string | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<EmployeeEntity>) {
    if (partial.position) {
      partial.position = new PositionEntity(partial.position);
    }
    Object.assign(this, partial);
  }
}
