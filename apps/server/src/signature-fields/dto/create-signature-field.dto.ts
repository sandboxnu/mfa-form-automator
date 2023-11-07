import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSignatureFieldDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsInt()
  @ApiProperty()
  order: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  signerPositionId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  formTemplateId: string;
}
