import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';
import { FormInstance } from 'src/models/formInstance.entity';
import { SignatureChainLink } from '../models/signatureChainLink.entity';

export class CreateFormDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty()
  pdfLink: string;
}

export class FormDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty()
  pdfLink: string;

  @ApiProperty()
  signatureChainLinkHead: SignatureChainLink;

  @ApiProperty()
  formInstances: FormInstance[];
}
