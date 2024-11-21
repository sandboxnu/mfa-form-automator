import { ApiProperty } from '@nestjs/swagger';
import { Document } from '@prisma/client';
import { FormInstanceEntity } from '@server/form-instances/entities/form-instance.entity';
import { FormTemplateEntity } from '@server/form-templates/entities/form-template.entity';
import { Exclude } from 'class-transformer';

export class DocumentEntity extends Document {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  byteData: Buffer;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  formInstances: FormInstanceEntity[];

  @Exclude()
  formTemplate: FormTemplateEntity;

  constructor(partial: Partial<DocumentEntity>) {
    super();
    Object.assign(this, partial);
  }
}
