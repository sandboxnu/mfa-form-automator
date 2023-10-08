import { ApiProperty } from '@nestjs/swagger';
import { Signature } from '@prisma/client';
import { EmployeeEntity } from '@server/employees/entities/employee.entity';
import { PositionEntity } from '@server/positions/entities/position.entity';
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
  signerPositionId: string | null;

  @ApiProperty()
  signerPosition: PositionEntity | null;

  @ApiProperty()
  userSignedById: string | null;

  @ApiProperty()
  userSignedBy: EmployeeEntity | null;

  @Exclude()
  formInstanceId: string;
}
