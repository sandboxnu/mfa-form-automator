import { ApiProperty } from '@nestjs/swagger';
import { EmployeeScope } from '@prisma/client';

export class UserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  scope: EmployeeScope;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
