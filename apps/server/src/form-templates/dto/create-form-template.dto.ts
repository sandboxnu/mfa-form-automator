import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsArray,
} from 'class-validator';
import { SignatureField } from '@prisma/client';

export class CreateFormTemplateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty()
  formDocLink: string;

  @IsArray()
  @ApiProperty()
  signatureFields: SignatureField[];
}
