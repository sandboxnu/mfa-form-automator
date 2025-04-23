import { ApiProperty } from '@nestjs/swagger';
import { FieldGroup } from '@prisma/client';
import { TemplateBoxBaseEntity } from './template-box.entity';
import { Exclude } from 'class-transformer';

export class FieldGroupBaseEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  order: number;

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

export class FieldGroupEntity implements FieldGroup {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  order: number;

  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  formTemplateId: string;

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
