import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSignatureDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  order: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  assignedUserId: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  assignedUserIds: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  signerPositionId: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  signerDepartmentId: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  signerType: $Enums.SignerType;
}
