import { ApiProperty } from '@nestjs/swagger';
import { SignerType } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { EmployeeBaseEntity } from '../../employees/entities/employee.entity';
import { PositionBaseEntity } from '../../positions/entities/position.entity';
import { DepartmentBaseEntity } from '../../departments/entities/department.entity';
import { FieldGroupBaseEntity } from '../../field-group/entities/field-group.entity';

export class AssignedGroupEntityHydrated {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fieldGroup: FieldGroupBaseEntity;

  @ApiProperty()
  order: number;

  @ApiProperty()
  signed: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty()
  signedDocLink: string | null;

  @ApiProperty({ enum: SignerType })
  signerType: SignerType;

  @IsOptional()
  @ApiProperty()
  signingEmployee: EmployeeBaseEntity | null;

  @IsOptional()
  @ApiProperty()
  signerPosition: PositionBaseEntity | null;

  @IsOptional()
  @ApiProperty()
  signerDepartment: DepartmentBaseEntity | null;

  @IsOptional()
  @ApiProperty()
  signerEmployee: EmployeeBaseEntity | null;

  @IsOptional()
  @ApiProperty({
    type: EmployeeBaseEntity,
    isArray: true,
  })
  signerEmployeeList: EmployeeBaseEntity[] | null;

  constructor(partial: Partial<AssignedGroupEntityHydrated>) {
    if (partial.signingEmployee) {
      this.signingEmployee = new EmployeeBaseEntity(partial.signingEmployee);
    }
    if (partial.signerPosition) {
      this.signerPosition = new PositionBaseEntity(partial.signerPosition);
    }
    if (partial.signerDepartment) {
      this.signerDepartment = new DepartmentBaseEntity(
        partial.signerDepartment,
      );
    }
    if (partial.signerEmployee) {
      this.signerEmployee = new EmployeeBaseEntity(partial.signerEmployee);
    }
    if (partial.signerEmployeeList) {
      this.signerEmployeeList = partial.signerEmployeeList.map(
        (employee) => new EmployeeBaseEntity(employee),
      );
    }
    Object.assign(this, partial);
  }
}
