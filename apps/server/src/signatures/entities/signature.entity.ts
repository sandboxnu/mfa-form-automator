import { ApiProperty } from '@nestjs/swagger';
import { Signature } from '@prisma/client';
import { EmployeeBaseEntity } from '../../employees/entities/employee.entity';
import { PositionBaseEntity } from '../../positions/entities/position.entity';
import { Exclude } from 'class-transformer';

export class SignatureEntity implements Signature {
  @ApiProperty()
  id: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  signed: boolean;

  @ApiProperty()
  signedDocLink: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  signerPositionId: string;

  @ApiProperty()
  signerPosition: PositionBaseEntity;

  @ApiProperty()
  assignedUserId: string | null;

  @ApiProperty()
  assignedUser: EmployeeBaseEntity | null;

  @Exclude()
  formInstanceId: string;

  constructor(partial: Partial<SignatureEntity>) {
    if (partial.signerPosition) {
      partial.signerPosition = new PositionBaseEntity(partial.signerPosition);
    }
    if (partial.assignedUser) {
      partial.assignedUser = new EmployeeBaseEntity(partial.assignedUser);
    }
    Object.assign(this, partial);
  }
}
