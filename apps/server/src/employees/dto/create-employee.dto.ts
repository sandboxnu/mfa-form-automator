import { ApiProperty } from '@nestjs/swagger';
import { EmployeeScope } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsUUID()
  @ApiProperty()
  positionId?: string | null;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: EmployeeScope })
  scope: EmployeeScope;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accessToken: string;
}
