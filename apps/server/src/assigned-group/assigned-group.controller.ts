import { Body, Controller, Param, Patch, ValidationPipe } from '@nestjs/common';
import { AssignedGroupService } from './assigned-group.service';
import { UpdateAssignedGroupSignerDto } from './dto/update-assigned-group-signer.dto';

@Controller('signatures')
export class AssignedGroupController {
  constructor(private readonly assignedGroupService: AssignedGroupService) {}

  @Patch(':id/signer')
  updateAssignedGroupSigner(
    @Param('id') assignedGroupId: string,
    @Body(new ValidationPipe({ transform: true }))
    updateAssignedGroupSigner: UpdateAssignedGroupSignerDto,
  ) {
    return this.assignedGroupService.updateSigner(
      assignedGroupId,
      updateAssignedGroupSigner,
    );
  }
}
