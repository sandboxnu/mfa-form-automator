import { ApiProperty } from '@nestjs/swagger';
import { DepartmentBaseEntity } from './../../departments/entities/department.entity';
import { EmployeeBaseEntity } from '../../employees/entities/employee.entity';

export class PositionBaseEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  department: DepartmentBaseEntity | null;

  constructor(partial: Partial<PositionBaseEntity>) {
    if (partial.department) {
      partial.department = new DepartmentBaseEntity(partial.department);
    }
    Object.assign(this, partial);
  }
}

export class PositionEntityEmployeeHydrated extends PositionBaseEntity {
  @ApiProperty()
  employees: EmployeeBaseEntity[];

  constructor(partial: Partial<PositionEntityEmployeeHydrated>) {
    super(partial);
    if (partial.employees) {
      partial.employees = partial.employees.map(
        (employee) => new EmployeeBaseEntity(employee),
      );
    }
    Object.assign(this, partial);
  }
}
