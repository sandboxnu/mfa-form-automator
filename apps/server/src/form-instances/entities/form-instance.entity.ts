import { ApiProperty } from '@nestjs/swagger';
import { FormInstance } from '@prisma/client';
import { FormTemplateBaseEntity } from '../../form-templates/entities/form-template.entity';
import { Exclude } from 'class-transformer';
import { AssignedGroupEntity } from '../../assigned-group/entities/assigned-group.entity';
import { IsOptional } from 'class-validator';
import { EmployeeBaseEntity } from '../../employees/entities/employee.entity';

export class FormInstanceBaseEntity implements FormInstance {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  description: string | null;

  @Exclude({ toPlainOnly: true })
  formDocLink: string;

  @Exclude({ toPlainOnly: true })
  completed: boolean;

  @Exclude({ toPlainOnly: true })
  markedCompleted: boolean;

  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  completedAt: Date | null;

  @Exclude({ toPlainOnly: true })
  markedCompletedAt: Date | null;

  @Exclude({ toPlainOnly: true })
  originatorId: string;

  @Exclude({ toPlainOnly: true })
  originator: EmployeeBaseEntity;

  @Exclude({ toPlainOnly: true })
  formTemplateId: string;

  @Exclude({ toPlainOnly: true })
  formTemplate: FormTemplateBaseEntity;

  @Exclude({ toPlainOnly: true })
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
    type: AssignedGroupEntity,
  })
  assignedGroups: AssignedGroupEntity[];

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
        (assignedGroup) => new AssignedGroupEntity(assignedGroup),
      );
    }

    Object.assign(this, partial);
  }
}
