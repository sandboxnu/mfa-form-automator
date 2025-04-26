import { ApiProperty } from '@nestjs/swagger';
import { FormTemplate } from '@prisma/client';
import { Exclude } from 'class-transformer';
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

  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
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

  constructor(partial: Partial<FormTemplateEntity>) {
    super(partial);
    if (partial.fieldGroups) {
      partial.fieldGroups = partial.fieldGroups.map(
        (fieldGroup) => new FieldGroupBaseEntity(fieldGroup),
      );
    }
    Object.assign(this, partial);
  }
}
