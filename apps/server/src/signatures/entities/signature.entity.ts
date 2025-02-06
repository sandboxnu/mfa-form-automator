import { ApiProperty } from '@nestjs/swagger';
import { SignerType, Signature } from '@prisma/client';
import { EmployeeBaseEntity } from '../../employees/entities/employee.entity';
import { PositionBaseEntity } from '../../positions/entities/position.entity';
import { Exclude } from 'class-transformer';
import { DepartmentEntity } from '../../departments/entities/department.entity';
import { IsEnum } from 'class-validator';

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
  signerEmployeeId: string | null;

  @ApiProperty()
  signerEmployee: EmployeeBaseEntity | null;

  @ApiProperty()
  signerEmployeeList: EmployeeBaseEntity[];

  @ApiProperty()
  signingEmployeeId: string | null;

  @ApiProperty()
  signingEmployee: EmployeeBaseEntity | null;

  @IsEnum(SignerType)
  @ApiProperty({ enum: SignerType })
  signerType: SignerType;

  @Exclude()
  formInstanceId: string;

  constructor(partial: Partial<SignatureEntity>) {
    if (partial.signerPosition) {
      partial.signerPosition = new PositionBaseEntity(partial.signerPosition);
    }
    if (partial.signerDepartment) {
      partial.signerDepartment = new DepartmentEntity(partial.signerDepartment);
    }
    if (partial.signerEmployee) {
      partial.signerEmployee = new EmployeeBaseEntity(partial.signerEmployee);
    }
    if (partial.signingEmployee) {
      partial.signingEmployee = new EmployeeBaseEntity(partial.signingEmployee);
    }
    Object.assign(this, partial);
  }
}
