import { ApiProperty } from '@nestjs/swagger';
import { EmployeeScope } from '@prisma/client';
import { IsNotEmpty, IsString, MinLength, IsEmail } from 'class-validator';

export class RegisterEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  positionName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  departmentName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  signatureLink: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  scope: EmployeeScope;
}
