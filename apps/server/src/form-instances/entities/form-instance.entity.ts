import { ApiProperty } from '@nestjs/swagger';
import { Employee, FormInstance } from '@prisma/client';
import { FormTemplateBaseEntity } from '../../form-templates/entities/form-template.entity';
import { Exclude } from 'class-transformer';
import { SignatureEntity } from '../../signatures/entities/signature.entity';
import { EmployeeEntity } from '../../employees/entities/employee.entity';

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

  @ApiProperty()
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
