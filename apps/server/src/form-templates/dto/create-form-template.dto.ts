import { ApiProperty } from '@nestjs/swagger';
import { CreateSignatureFieldDto } from '../../signature-fields/dto/create-signature-field.dto';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

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
  @ArrayMinSize(1)
  @ApiProperty({
    isArray: true,
    type: CreateSignatureFieldDto,
  })
  signatureFields: CreateSignatureFieldDto[];
}
