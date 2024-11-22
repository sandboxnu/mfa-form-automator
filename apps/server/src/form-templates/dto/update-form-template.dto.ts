import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateFormTemplateDto } from './create-form-template.dto';

export class UpdateFormTemplateDto extends PartialType(
  OmitType(CreateFormTemplateDto, ['signatureFields', 'documentId'] as const),
) {}
