import { ApiProperty } from '@nestjs/swagger';
import { FieldGroup } from '@prisma/client';
import { TemplateBoxBaseEntity } from './template-box.entity';

export class FieldGroupBaseEntity implements FieldGroup {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  formTemplateId: string | null;

  @ApiProperty({
    isArray: true,
    type: TemplateBoxBaseEntity,
  })
  templateBoxes: TemplateBoxBaseEntity[];

  constructor(partial: Partial<FieldGroupBaseEntity>) {
    if (partial.templateBoxes) {
      partial.templateBoxes = partial.templateBoxes.map(
        (templateBox) => new TemplateBoxBaseEntity(templateBox),
      );
    }

    Object.assign(this, partial);
  }
}
