import { ApiProperty } from '@nestjs/swagger';
import { DepartmentBaseEntity } from './../../departments/entities/department.entity';

export class PositionBaseEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  department: DepartmentBaseEntity;

  constructor(partial: Partial<PositionBaseEntity>) {
    if (partial.department) {
      partial.department = new DepartmentBaseEntity(partial.department);
    }
    Object.assign(this, partial);
  }
}
