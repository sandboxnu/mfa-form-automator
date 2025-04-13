import { ApiProperty } from '@nestjs/swagger';
import { SignatureBoxFieldType, TemplateBox } from '@prisma/client';

export class TemplateBoxBaseEntity implements TemplateBox {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: SignatureBoxFieldType })
  type: SignatureBoxFieldType;

  @ApiProperty()
  x_coordinate: number;

  @ApiProperty()
  y_coordinate: number;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  fieldGroupId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<TemplateBoxBaseEntity>) {
    Object.assign(this, partial);
  }
}
