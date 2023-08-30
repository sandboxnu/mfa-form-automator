import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  departmentId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
