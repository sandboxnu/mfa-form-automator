import { ApiProperty } from '@nestjs/swagger';
import { Department } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class DepartmentBaseEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  constructor(partial: Partial<DepartmentBaseEntity>) {
    Object.assign(this, partial);
  }
}

export class DepartmentEntity implements Department {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  constructor(partial: Partial<DepartmentEntity>) {
    Object.assign(this, partial);
  }
}
