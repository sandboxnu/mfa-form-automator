import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormTemplatesService } from './form-templates.service';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';

@Controller('form-templates')
export class FormTemplatesController {
  constructor(private readonly formTemplatesService: FormTemplatesService) {}

  @Post()
  create(@Body() createFormTemplateDto: CreateFormTemplateDto) {
    return this.formTemplatesService.create(createFormTemplateDto);
  }

  @Get()
  findAll() {
    return this.formTemplatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formTemplatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormTemplateDto: UpdateFormTemplateDto) {
    return this.formTemplatesService.update(+id, updateFormTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formTemplatesService.remove(+id);
  }
}
