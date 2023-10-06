import { ApiProperty } from '@nestjs/swagger';
import { FormTemplate } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { SignatureFieldEntity } from './../../signature-fields/entities/signature-field.entity';
import { FormInstanceEntity } from './../../form-instances/entities/form-instance.entity';

export class FormTemplateBaseEntity implements FormTemplate {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  formDocLink: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<FormTemplateEntity>) {
    Object.assign(this, partial);
  }
}

export class FormTemplateEntity extends FormTemplateBaseEntity {
  @ApiProperty()
  signatureFields: SignatureFieldEntity[];

  @ApiProperty()
  formInstances: FormInstanceEntity[];

  constructor(partial: Partial<FormTemplateEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
