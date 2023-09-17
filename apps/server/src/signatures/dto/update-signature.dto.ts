import { PartialType } from '@nestjs/swagger';
import { CreateSignatureDto } from './create-signature.dto';

export class UpdateSignatureDto extends PartialType(CreateSignatureDto) {}
