import { ApiProperty } from '@nestjs/swagger';
import { Employee, FormInstance } from '@prisma/client';
import { FormTemplateBaseEntity } from '../../form-templates/entities/form-template.entity';
import { Exclude } from 'class-transformer';
import { SignatureEntity } from '../../signatures/entities/signature.entity';
import { EmployeeEntity } from '../../employees/entities/employee.entity';
import { DocumentEntity } from '@server/documents/entities/document.entity';

export class FormInstanceBaseEntity implements FormInstance {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

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
  originator: Employee;

  @Exclude()
  formTemplateId: string;

  @Exclude()
  formTemplate: FormTemplateBaseEntity;

  @Exclude()
  signatures: SignatureEntity[];

  @Exclude()
  documentId: string | null;

  @Exclude()
  document: DocumentEntity | null;

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
  originator: Employee;

  @Exclude()
  formTemplateId: string;

  @ApiProperty()
  formTemplate: FormTemplateBaseEntity;

  @Exclude()
  documentId: string | null;

  @ApiProperty()
  document: DocumentEntity | null;

  @ApiProperty({
    isArray: true,
    type: SignatureEntity,
  })
  signatures: SignatureEntity[];

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
    if (partial.signatures) {
      partial.signatures = partial.signatures.map(
        (signature) => new SignatureEntity(signature),
      );
    }

    Object.assign(this, partial);
  }
}
