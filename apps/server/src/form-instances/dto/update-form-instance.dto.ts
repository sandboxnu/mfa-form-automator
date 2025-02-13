import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateFormInstanceDto } from './create-form-instance.dto';

export class UpdateFormInstanceDto extends PartialType(
  OmitType(CreateFormInstanceDto, [
    'assignedGroups',
    'originatorId',
    'formTemplateId',
  ] as const),
) {}
