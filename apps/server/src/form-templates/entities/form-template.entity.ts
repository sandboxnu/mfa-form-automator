import { ApiProperty } from '@nestjs/swagger';
import { FormTemplate } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { FormInstanceEntity } from './../../form-instances/entities/form-instance.entity';
import { FieldGroupBaseEntity } from '../../field-group/entities/field-group.entity';
import { IsOptional } from 'class-validator';

export class FormTemplateBaseEntity implements FormTemplate {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  pageWidth: number;

  @ApiProperty()
  pageHeight: number;

  @ApiProperty()
  formDocLink: string;

  @IsOptional()
  @ApiProperty()
  description: string | null;

  @ApiProperty()
  disabled: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<FormTemplateEntity>) {
    Object.assign(this, partial);
  }
}

export class FormTemplateEntity extends FormTemplateBaseEntity {
  @ApiProperty({
    isArray: true,
    type: FieldGroupBaseEntity,
  })
  fieldGroups: FieldGroupBaseEntity[];

  @ApiProperty()
  formInstances: FormInstanceEntity[];

  constructor(partial: Partial<FormTemplateEntity>) {
    super(partial);
    if (partial.fieldGroups) {
      partial.fieldGroups = partial.fieldGroups.map(
        (fieldGroup) => new FieldGroupBaseEntity(fieldGroup),
      );
    }
    if (partial.formInstances) {
      partial.formInstances = partial.formInstances.map(
        (formInstance) => new FormInstanceEntity(formInstance),
      );
    }
    Object.assign(this, partial);
  }
}
