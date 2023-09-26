import { ApiProperty } from '@nestjs/swagger';
import { Position } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { SignatureFieldEntity } from '@server/signature-fields/entities/signature-field.entity';

export class PositionEntity implements Position {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  single: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @ApiProperty()
  signatureFields: SignatureFieldEntity[];

  constructor(partial: Partial<PositionEntity>) {
    Object.assign(this, partial);
  }
}
