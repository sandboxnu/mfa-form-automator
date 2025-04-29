import { ApiProperty } from '@nestjs/swagger';
import { Department } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { PositionBaseEntity } from '../../positions/entities/position.entity';

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

export class DepartmentEntityHydrated extends DepartmentEntity {
  @ApiProperty()
  positions: PositionBaseEntity[];

  constructor(partial: Partial<DepartmentEntityHydrated>) {
    super(partial);
    if (partial.positions) {
      partial.positions = partial.positions.map(
        (position) => new PositionBaseEntity(position),
      );
    }
    Object.assign(this, partial);
  }
}
