import {
  Body,
  Controller,
  Param,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AssignedGroupService } from './assigned-group.service';
import { UpdateAssignedGroupSignerDto } from './dto/update-assigned-group-signer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('signatures')
export class AssignedGroupController {
  constructor(private readonly assignedGroupService: AssignedGroupService) {}

  @Patch(':id/signer')
  @UseGuards(JwtAuthGuard)
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
