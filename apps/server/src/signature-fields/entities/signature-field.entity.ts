import { SignatureField } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { PositionEntity } from '../../positions/entities/position.entity';

export class SignatureFieldEntity implements SignatureField {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  order: number;

  @Exclude()
  signerPositionId: string | null;

  @ApiProperty()
  signerPosition: PositionEntity | null;

  @Exclude()
  formTemplateId: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<SignatureFieldEntity>) {
    if (partial.signerPosition) {
      partial.signerPosition = new PositionEntity(partial.signerPosition);
    }

    Object.assign(this, partial);
  }
}
