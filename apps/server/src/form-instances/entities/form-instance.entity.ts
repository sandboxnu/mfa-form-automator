import { ApiProperty } from '@nestjs/swagger';
import { Employee, FormInstance } from '@prisma/client';
import { FormTemplateBaseEntity } from '../../form-templates/entities/form-template.entity';
import { Exclude } from 'class-transformer';

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
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  originatorId: string;

  @ApiProperty()
  originator: Employee;

  @Exclude()
  formTemplateId: string;

  @ApiProperty()
  formTemplate: FormTemplateBaseEntity;

  constructor(partial: Partial<FormInstanceEntity>) {
    Object.assign(this, partial);
  }
}
