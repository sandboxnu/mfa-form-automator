import { SignatureField } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { PositionBaseEntity } from '../../positions/entities/position.entity';

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
  signerPosition: PositionBaseEntity | null;

  @Exclude()
  formTemplateId: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<SignatureFieldEntity>) {
    if (partial.signerPosition) {
      partial.signerPosition = new PositionBaseEntity(partial.signerPosition);
    }

    Object.assign(this, partial);
  }
}
