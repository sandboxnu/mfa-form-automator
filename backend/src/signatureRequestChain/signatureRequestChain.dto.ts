import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSignatureRequestChainDto {
  @IsNotEmpty()
  @ApiProperty()
  formId: number;

  @IsNotEmpty()
  @ApiProperty()
  formInstanceId: number;
}

export class SignatureRequestChainLinkDto {
  @ApiProperty()
  formInstanceId: number;

  @ApiProperty()
  isSigned: boolean;

  @ApiProperty()
  canSign: boolean;

  @ApiProperty()
  nextId: number;
}
