import { SignatureField } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { PositionEntity } from '@server/positions/entities/position.entity';
import { FormTemplateEntity } from '@server/form-templates/entities/form-template.entity';

export class SignatureFieldEntity implements SignatureField {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  order: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  signerPositionId: string | null;

  @Exclude()
  formTemplateId: string;

  @ApiProperty()
  signerPosition: PositionEntity | null;

  @ApiProperty()
  formTemplate: FormTemplateEntity;

  constructor(partial: Partial<SignatureFieldEntity>) {
    Object.assign(this, partial);
  }
}
