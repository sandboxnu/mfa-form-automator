import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSignatureDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  order: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  assignedUserId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  signerPositionId: string;
}
