import { ApiProperty } from '@nestjs/swagger';
import { Signature } from '@prisma/client';
import { EmployeeBaseEntity } from '../../employees/entities/employee.entity';
import { PositionEntity } from '../../positions/entities/position.entity';
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
  signerPosition: PositionEntity;

  @ApiProperty({
    required: false,
  })
  userSignedById: string | null;

  @ApiProperty({
    required: false,
  })
  userSignedBy: EmployeeBaseEntity | null;

  @Exclude()
  formInstanceId: string;

  constructor(partial: Partial<SignatureEntity>) {
    if (partial.signerPosition) {
      partial.signerPosition = new PositionEntity(partial.signerPosition);
    }
    if (partial.userSignedBy) {
      partial.userSignedBy = new EmployeeBaseEntity(partial.userSignedBy);
    }

    Object.assign(this, partial);
  }
}
