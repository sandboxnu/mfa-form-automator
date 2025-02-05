import { ApiProperty } from '@nestjs/swagger';
import { SignerType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class ConnectEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id: string;
}

export class CreateAssignedGroupDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  formInstanceId: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  order: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fieldGroupId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: SignerType })
  signerType: SignerType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  signerEmployeeId: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  signerPositionId: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  signerDepartmentId: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConnectEmployeeDto)
  @ApiProperty({ type: [ConnectEmployeeDto] })
  signerEmployeeList: ConnectEmployeeDto[]; // Update to an array of IDs for connecting
}
