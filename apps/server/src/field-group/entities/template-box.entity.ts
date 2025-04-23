import { ApiProperty } from '@nestjs/swagger';
import { SignatureBoxFieldType } from '@prisma/client';

export class TemplateBoxBaseEntity {
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

  constructor(partial: Partial<TemplateBoxBaseEntity>) {
    Object.assign(this, partial);
  }
}
