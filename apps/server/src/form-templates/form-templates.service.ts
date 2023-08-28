import { Injectable } from '@nestjs/common';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';

@Injectable()
export class FormTemplatesService {
  create(createFormTemplateDto: CreateFormTemplateDto) {
    return 'This action adds a new formTemplate';
  }

  findAll() {
    return `This action returns all formTemplates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} formTemplate`;
  }

  update(id: number, updateFormTemplateDto: UpdateFormTemplateDto) {
    return `This action updates a #${id} formTemplate`;
  }

  remove(id: number) {
    return `This action removes a #${id} formTemplate`;
  }
}
