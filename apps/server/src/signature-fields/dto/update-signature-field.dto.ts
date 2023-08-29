import { PartialType } from '@nestjs/swagger';
import { CreateSignatureFieldDto } from './create-signature-field.dto';

export class UpdateSignatureFieldDto extends PartialType(
  CreateSignatureFieldDto,
) {}
