import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssignedGroup, Position, SignerType } from '@prisma/client';
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
  @ApiPropertyOptional()
  signedDocLink: string | null;

  @IsDate()
  @ApiProperty()
  createdAt: Date;

  @IsDate()
  @ApiProperty()
  updatedAt: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  signerPositionId: string | null;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  signerDepartmentId: string | null;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  signerEmployeeId: string | null;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
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
  @ApiPropertyOptional()
  signingEmployee: EmployeeBaseEntity | null;

  @IsOptional()
  @ApiPropertyOptional()
  signerPosition: PositionBaseEntity | null;

  @IsOptional()
  @ApiPropertyOptional()
  signerDepartment: DepartmentEntity | null;

  @IsOptional()
  @ApiPropertyOptional()
  signerEmployee: EmployeeBaseEntity | null;

  @IsOptional()
  @ApiPropertyOptional({
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
