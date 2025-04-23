import { ApiProperty } from '@nestjs/swagger';
import { FormInstance } from '@prisma/client';
import { FormTemplateBaseEntity } from '../../form-templates/entities/form-template.entity';
import { Exclude } from 'class-transformer';
import { AssignedGroupEntityHydrated } from '../../assigned-group/entities/assigned-group.entity';
import { EmployeeBaseEntity } from '../../employees/entities/employee.entity';

export class FormInstanceEntity implements FormInstance {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  formDocLink: string;

  @ApiProperty()
  completed: boolean;

  @ApiProperty()
  markedCompleted: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    required: false,
  })
  completedAt: Date | null;

  @ApiProperty({
    required: false,
  })
  markedCompletedAt: Date | null;

  @Exclude({ toPlainOnly: true })
  originatorId: string;

  @ApiProperty()
  originator: EmployeeBaseEntity;

  @Exclude({ toPlainOnly: true })
  formTemplateId: string;

  @ApiProperty()
  formTemplate: FormTemplateBaseEntity;

  @ApiProperty({
    isArray: true,
    type: AssignedGroupEntityHydrated,
  })
  assignedGroups: AssignedGroupEntityHydrated[];

  constructor(partial: Partial<FormInstanceEntity>) {
    if (partial.originator) {
      partial.originator = new EmployeeBaseEntity(partial.originator);
    }
    if (partial.formTemplate) {
      partial.formTemplate = new FormTemplateBaseEntity(partial.formTemplate);
    }
    if (partial.originator) {
      partial.originator = new EmployeeBaseEntity(partial.originator);
    }
    if (partial.assignedGroups) {
      partial.assignedGroups = partial.assignedGroups.map(
        (assignedGroup) => new AssignedGroupEntityHydrated(assignedGroup),
      );
    }

    Object.assign(this, partial);
  }
}
