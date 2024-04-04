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
  assignedUserId: string;

  @ApiProperty()
  assignedUser: EmployeeBaseEntity;

  @ApiProperty({
    required: false
  })
  signerPositionId: string | null;

  @Exclude()
  formInstanceId: string;

  constructor(partial: Partial<SignatureEntity>) {
    if (partial.assignedUser) {
      partial.assignedUser = new EmployeeBaseEntity(partial.assignedUser);
    }

    Object.assign(this, partial);
  }
}
