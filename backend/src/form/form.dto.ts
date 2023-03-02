import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';
import { FormInstance } from '../models/formInstance.entity';
import { SignatureChainLink } from '../models/signatureChainLink.entity';
import { CreateSignatureChainLinkDto } from '../signatureChain/signatureChain.dto';

export class CreateFormDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty()
  pdfLink: string;

  @IsNotEmpty()
  @ApiProperty()
  signatureChainLinks: CreateSignatureChainLinkDto[];
}

export class CreateFormDtoInternal {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  pdfLink: string;

  signatureChainLinkHead: SignatureChainLink;

  formInstances: FormInstance[];
}

export class FormDto {
  @IsNotEmpty()
  @ApiProperty()
  id: number;

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
