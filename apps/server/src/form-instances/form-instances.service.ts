import { Injectable } from '@nestjs/common';
import { CreateFormInstanceDto } from './dto/create-form-instance.dto';
import { UpdateFormInstanceDto } from './dto/update-form-instance.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FormTemplatesService } from '@server/form-templates/form-templates.service';

@Injectable()
export class FormInstancesService {
  constructor(private prisma: PrismaService, private formTemplateService: FormTemplatesService) {}

  /**
   * Create a new form instance. 
   * @param createFormInstanceDto 
   */
  async create(createFormInstanceDto: CreateFormInstanceDto) {
    const formTemplate = this.formTemplateService.findOne(createFormInstanceDto.formTemplateId);
    const newFormInstance = await this.prisma.formInstance.create({
      data: {
        name: createFormInstanceDto.name,
        signatures: {create: createFormInstanceDto.signatures},
        formTemplate : formTemplate,
        formTemplateId: createFormInstanceDto.formTemplateId
      }
    });
    return newFormInstance;
  }

   
  async findAll(limit?: number) {
    const formInstances = await this.prisma.formInstance.findMany({
      take: limit,
    });
    return formInstances;
 }
 
  async findOne(id: string) {
    const formInstance = await this.prisma.formInstance.findFirstOrThrow({
      where: {
        id: id,
      },
    });
    return formInstance;
  }

  async update(id: string, updateFormInstanceDto: UpdateFormInstanceDto) {
    const updatedFormInstance = this.prisma.formInstance.update({
      where: {
        id: id,
      },
      data: {
        name: updateFormInstanceDto.name, 
        signatures: {create: updateFormInstanceDto.signatures}
      },
    });
    return updatedFormInstance;
  }

  async remove(id: string) {
    await this.prisma.formInstance.delete({
      where: {
        id: id,
      },
    });
  }
}