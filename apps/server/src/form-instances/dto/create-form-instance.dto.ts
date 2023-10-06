import { ApiProperty } from '@nestjs/swagger';
import { Signature } from '@prisma/client';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateFormInstanceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty()
  signatures: Signature[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  originatorId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  formTemplateId: string;
}
