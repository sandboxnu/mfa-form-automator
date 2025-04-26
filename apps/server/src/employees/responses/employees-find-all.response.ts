import { ApiProperty } from '@nestjs/swagger';
import { EmployeeScope } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import { PositionBaseEntity } from '../../positions/entities/position.entity';

export class EmployeeBaseEntityResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @Exclude({ toPlainOnly: true })
  positionId: string | null;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: () => String, required: false })
  signatureLink: string | null;

  @ApiProperty({ enum: EmployeeScope, required: false })
  scope: EmployeeScope;

  @Exclude({ toPlainOnly: true })
  pswdHash: string | null;

  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  refreshToken: string | null;

  @ApiProperty({
    type: () => PositionBaseEntity,
    required: false,
    nullable: true,
    description: 'Position of the employee, null if not assigned',
  })
  position: PositionBaseEntity | null;

  constructor(partial: Partial<EmployeeBaseEntityResponse>) {
    if (partial.position) {
      partial.position = new PositionBaseEntity(partial.position);
    }
    Object.assign(this, partial);
  }
}

export class EmployeesFindAllResponse {
  @ApiProperty()
  count: number;

  @ApiProperty({ type: [EmployeeBaseEntityResponse] })
  @Type(() => EmployeeBaseEntityResponse)
  employees: EmployeeBaseEntityResponse[];

  constructor(count: number, employees: EmployeeBaseEntityResponse[]) {
    this.count = count;
    this.employees = employees;
  }
}
