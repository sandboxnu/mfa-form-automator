import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSignatureDto } from './create-signature.dto';

export class UpdateSignatureSignerDto extends PartialType(
  OmitType(CreateSignatureDto, ['order'] as const),
) {}
