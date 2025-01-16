import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ConnectEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id: string; // Use an existing Employee ID to connect
}

export class CreateSignatureDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  order: number;

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

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  signerType: $Enums.SignerType;
}
