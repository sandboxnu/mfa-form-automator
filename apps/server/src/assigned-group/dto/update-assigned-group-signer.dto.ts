import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAssignedGroupDto } from './create-assigned-group.dto';

export class UpdateAssignedGroupSignerDto extends PartialType(
  OmitType(CreateAssignedGroupDto, ['order'] as const),
) {}
