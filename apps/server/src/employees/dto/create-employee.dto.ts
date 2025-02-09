import { ApiProperty } from '@nestjs/swagger';
import { EmployeeScope } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

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
  @IsNotEmpty()
  @ApiProperty()
  positionId: string;

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
  signatureLink: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: EmployeeScope })
  scope: EmployeeScope;
}
