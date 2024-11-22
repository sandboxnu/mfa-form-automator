import { ApiProperty } from '@nestjs/swagger';
import { FormTemplate } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { SignatureFieldEntity } from './../../signature-fields/entities/signature-field.entity';
import {
  FormInstanceBaseEntity,
  FormInstanceEntity,
} from './../../form-instances/entities/form-instance.entity';
import { DocumentEntity } from '@server/documents/entities/document.entity';

export class FormTemplateBaseEntity implements FormTemplate {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  documentId: string | null;

  @Exclude()
  document: DocumentEntity | null;

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
    if (partial.signatureFields) {
      partial.signatureFields = partial.signatureFields.map(
        (signatureField) => new SignatureFieldEntity(signatureField),
      );
    }
    if (partial.formInstances) {
      partial.formInstances = partial.formInstances.map(
        (formInstance) => new FormInstanceBaseEntity(formInstance),
      );
    }
    Object.assign(this, partial);
  }
}
