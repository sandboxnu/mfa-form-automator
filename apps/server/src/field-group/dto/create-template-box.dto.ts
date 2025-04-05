import { ApiProperty } from '@nestjs/swagger';
import { SignatureBoxFieldType } from '@prisma/client';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateTemplateBoxDto {
  @ApiProperty({
    enum: SignatureBoxFieldType,
  })
  type: SignatureBoxFieldType;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  x_coordinate: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  y_coordinate: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  width: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  height: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  page: number;
}
