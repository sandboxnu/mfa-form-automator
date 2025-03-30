import { ApiProperty } from '@nestjs/swagger';
import { AssignedGroup, SignerType } from '@prisma/client';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { EmployeeBaseEntity } from '../../employees/entities/employee.entity';
import { PositionBaseEntity } from '../../positions/entities/position.entity';
import { DepartmentEntity } from '../../departments/entities/department.entity';
import { FieldGroupBaseEntity } from '../../field-group/entities/field-group.entity';

export class AssignedGroupBaseEntity implements AssignedGroup {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fieldGroupId: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  signed: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty()
  signedDocLink: string | null;

  @IsDate()
  @ApiProperty()
  createdAt: Date;

  @IsDate()
  @ApiProperty()
  updatedAt: Date;

  @IsString()
  @IsOptional()
  @ApiProperty()
  signerPositionId: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  signerDepartmentId: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  signerEmployeeId: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  signingEmployeeId: string | null;

  @ApiProperty({ enum: SignerType })
  signerType: SignerType;

  @IsString()
  @ApiProperty()
  formInstanceId: string;

  constructor(partial: Partial<AssignedGroupBaseEntity>) {
    Object.assign(this, partial);
  }
}

export class AssignedGroupEntity extends AssignedGroupBaseEntity {
  @ApiProperty()
  fieldGroup: FieldGroupBaseEntity;

  @IsOptional()
  @ApiProperty()
  signingEmployee: EmployeeBaseEntity | null;

  @IsOptional()
  @ApiProperty()
  signerPosition: PositionBaseEntity | null;

  @IsOptional()
  @ApiProperty()
  signerDepartment: DepartmentEntity | null;

  @IsOptional()
  @ApiProperty()
  signerEmployee: EmployeeBaseEntity | null;

  @IsOptional()
  @ApiProperty({
    type: EmployeeBaseEntity,
    isArray: true,
  })
  signerEmployeeList: EmployeeBaseEntity[] | null;

  constructor(partial: Partial<AssignedGroupEntity>) {
    super(partial);
    if (partial.fieldGroup) {
      partial.fieldGroup = new FieldGroupBaseEntity(partial.fieldGroup);
    }
    if (partial.signingEmployee) {
      partial.signingEmployee = new EmployeeBaseEntity(partial.signingEmployee);
    }
    if (partial.signerEmployeeList) {
      partial.signerEmployeeList = partial.signerEmployeeList.map(
        (employee) => new EmployeeBaseEntity(employee),
      );
    }
    Object.assign(this, partial);
  }
}
