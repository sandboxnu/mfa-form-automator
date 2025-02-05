import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFieldGroupDto } from './dto/create-field-group.dto';

@Injectable()
export class FieldGroupService {
  constructor(private prisma: PrismaService) {}

  async create(createFieldGroupDto: CreateFieldGroupDto) {
    const newFieldGroup = await this.prisma.fieldGroup.create({
      data: {
        name: createFieldGroupDto.name,
        order: createFieldGroupDto.order,
        formTemplateId: createFieldGroupDto.formTemplateId,
        templateBoxes: {
          create: createFieldGroupDto.templateBoxes,
        },
      },
      include: {
        templateBoxes: true,
      },
    });
    return newFieldGroup;
  }

  async findAll() {
    return 'find all form templates';
  }
}
