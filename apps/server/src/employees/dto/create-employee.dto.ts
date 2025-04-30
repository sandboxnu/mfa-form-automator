import { ApiProperty } from '@nestjs/swagger';
import { EmployeeScope } from '@prisma/client';
import { Transform } from 'class-transformer';
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
  @ApiProperty({ required: false, nullable: true })
  @Transform(({ value }) => {
    if (value === 'null') return null;
    return value;
  })
  positionId?: string | null;

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
  @ApiProperty({ enum: EmployeeScope })
  scope: EmployeeScope;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accessToken: string;
}
