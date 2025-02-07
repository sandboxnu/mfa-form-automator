import { ApiProperty } from '@nestjs/swagger';
import { SignerType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';

export class ConnectEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id: string;
}

export class CreateAssignedGroupDto {
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
  @IsOptional()
  @ApiProperty()
  signerEmployeeId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  signerPositionId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  signerDepartmentId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConnectEmployeeDto)
  @ApiProperty({ type: [ConnectEmployeeDto] })
  signerEmployeeList: ConnectEmployeeDto[]; // Update to an array of IDs for connecting
}
