import { ApiProperty } from '@nestjs/swagger';
import { FormTemplateEntity } from '../entities/form-template.entity';

export class FormTemplateFindAllResponse {
  @ApiProperty()
  count: number;

  @ApiProperty({ type: [FormTemplateEntity] })
  formTemplates: FormTemplateEntity[];

  constructor(count: number, formTemplates: FormTemplateEntity[]) {
    this.count = count;
    this.formTemplates = formTemplates;
  }
}
