import { ApiProperty } from '@nestjs/swagger';
import { FormInstance } from '@prisma/client';
import { FormTemplateBaseEntity } from '../../form-templates/entities/form-template.entity';
import { Exclude } from 'class-transformer';
import { EmployeeEntity } from '../../employees/entities/employee.entity';
import { AssignedGroupEntity } from '../../assigned-group/entities/assigned-group.entity';

export class FormInstanceBaseEntity implements FormInstance {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @Exclude()
  formDocLink: string;

  @Exclude()
  completed: boolean;

  @Exclude()
  markedCompleted: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  completedAt: Date | null;

  @Exclude()
  markedCompletedAt: Date | null;

  @Exclude()
  originatorId: string;

  @Exclude()
  originator: EmployeeEntity;

  @Exclude()
  formTemplateId: string;

  @Exclude()
  formTemplate: FormTemplateBaseEntity;

  @Exclude()
  assignedGroups: AssignedGroupEntity[];

  constructor(partial: Partial<FormInstanceEntity>) {
    Object.assign(this, partial);
  }
}

export class FormInstanceEntity implements FormInstance {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

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

  @Exclude()
  originatorId: string;

  @ApiProperty()
  originator: EmployeeEntity;

  @Exclude()
  formTemplateId: string;

  @ApiProperty()
  formTemplate: FormTemplateBaseEntity;

  @ApiProperty({
    isArray: true,
    type: AssignedGroupEntity,
  })
  assignedGroups: AssignedGroupEntity[];

  constructor(partial: Partial<FormInstanceEntity>) {
    if (partial.originator) {
      partial.originator = new EmployeeEntity(partial.originator);
    }
    if (partial.formTemplate) {
      partial.formTemplate = new FormTemplateBaseEntity(partial.formTemplate);
    }
    if (partial.originator) {
      partial.originator = new EmployeeEntity(partial.originator);
    }
    if (partial.assignedGroups) {
      partial.assignedGroups = partial.assignedGroups.map(
        (assignedGroup) => new AssignedGroupEntity(assignedGroup),
      );
    }

    Object.assign(this, partial);
  }
}
