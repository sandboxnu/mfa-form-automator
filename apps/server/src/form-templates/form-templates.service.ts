import { Injectable } from '@nestjs/common';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Signature } from '@prisma/client';

@Injectable()
export class FormTemplatesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new form template.
   * @param createFormTemplateDto create form template dto
   * @returns the created employee, hydrated
   */
  async create(createFormTemplateDto: CreateFormTemplateDto) {
    const newFormTemplate = await this.prisma.formTemplate.create({
      data: {
        name: createFormTemplateDto.name,
        formDocLink: createFormTemplateDto.formDocLink,
        signatureFields: { create: createFormTemplateDto.signatureFields },
      }
    })
  }

  // create(createFormTemplateDto: CreateFormTemplateDto) {
  //   return 'This action adds a new formTemplate';
  // }
  // findAll() {
  //   return `This action returns all formTemplates`;
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} formTemplate`;
  // }
  // update(id: number, updateFormTemplateDto: UpdateFormTemplateDto) {
  //   return `This action updates a #${id} formTemplate`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} formTemplate`;
  // }
}
