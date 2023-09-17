import { ApiProperty } from '@nestjs/swagger';
import { Department } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class DepartmentEntity implements Department {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<DepartmentEntity>) {
    Object.assign(this, partial);
  }
}
