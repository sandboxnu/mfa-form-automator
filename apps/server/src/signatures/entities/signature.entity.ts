import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Signature } from '@prisma/client';
import { EmployeeBaseEntity } from '../../employees/entities/employee.entity';
import { PositionBaseEntity } from '../../positions/entities/position.entity';
import { Exclude } from 'class-transformer';
import { DepartmentEntity } from '../../departments/entities/department.entity';

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
  signerPosition: PositionBaseEntity | null;

  @ApiProperty()
  signerDepartmentId: string | null;

  @ApiProperty()
  signerDepartment: DepartmentEntity | null;

  @ApiProperty()
  assignedUserId: string | null;

  @ApiProperty()
  assignedUser: EmployeeBaseEntity | null;

  @ApiProperty()
  signerType: $Enums.SignerType;

  @Exclude()
  formInstanceId: string;

  constructor(partial: Partial<SignatureEntity>) {
    if (partial.signerPosition) {
      partial.signerPosition = new PositionBaseEntity(partial.signerPosition);
    }
    if (partial.signerDepartment) {
      partial.signerDepartment = new DepartmentEntity(partial.signerDepartment);
    }
    if (partial.assignedUser) {
      partial.assignedUser = new EmployeeBaseEntity(partial.assignedUser);
    }
    Object.assign(this, partial);
  }
}
