import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { CreateSignatureFieldDto } from '../../signature-fields/dto/create-signature-field.dto';

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
  @ApiProperty()
  signatureFields: CreateSignatureFieldDto[];

  // create signature fields
  // auto create empty form instances list
}
