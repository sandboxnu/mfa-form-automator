import { ApiProperty } from '@nestjs/swagger';
import { Employee, EmployeeScope } from '@prisma/client';
import { PositionBaseEntity } from './../../positions/entities/position.entity';
import { Exclude } from 'class-transformer';

export class EmployeeBaseEntity implements Employee {
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

  @Exclude({ toPlainOnly: true })
  signatureLink: string | null;

  @Exclude({ toPlainOnly: true })
  scope: EmployeeScope;

  @Exclude({ toPlainOnly: true })
  pswdHash: string | null;

  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  refreshToken: string | null;

  constructor(partial: Partial<EmployeeBaseEntity>) {
    Object.assign(this, partial);
  }
}

export class EmployeeSecureEntity implements Employee {
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

  @ApiProperty()
  signatureLink: string | null;

  @ApiProperty({ enum: EmployeeScope })
  scope: EmployeeScope;

  @Exclude({ toPlainOnly: true })
  pswdHash: string | null;

  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  refreshToken: string | null;

  constructor(partial: Partial<EmployeeSecureEntity>) {
    Object.assign(this, partial);
  }
}

export class EmployeeSecureEntityHydrated extends EmployeeSecureEntity {
  @ApiProperty()
  position: PositionBaseEntity | null;

  constructor(partial: Partial<EmployeeSecureEntityHydrated>) {
    super(partial);
    if (partial.position) {
      partial.position = new PositionBaseEntity(partial.position);
    }
    Object.assign(this, partial);
  }
}
