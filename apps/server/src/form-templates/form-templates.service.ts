import { Injectable } from '@nestjs/common';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { PrismaService } from '../prisma/prisma.service';

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
        signatureFields: { create: createFormTemplateDto.signatureFields },
      },
      include: {
        signatureFields: true,
        formInstances: {
          include: {
            formTemplate: true,
            originator: true,
            signatures: {
              include: {
                signerPosition: {
                  include: {
                    department: true,
                  },
                },
                signerDepartment: true,
                assignedUser: true,
              },
            },
          },
        },
      },
    });
    return newFormTemplate;
  }

  /**
   * Retrieve all form templates.
   * @param limit the number of form templates we want to retrieve (optional)
   * @returns all form templates, hydrated
   */
  async findAll(limit?: number) {
    const formTemplates = limit
      ? await this.prisma.formTemplate.findMany({
          take: limit,
          include: {
            signatureFields: true,
            formInstances: {
              include: {
                formTemplate: true,
                originator: true,
                document: true,
                signatures: {
                  include: {
                    signerPosition: {
                      include: {
                        department: true,
                      },
                    },
                    signerDepartment: true,
                    assignedUser: true,
                  },
                },
              },
            },
          },
        })
      : await this.prisma.formTemplate.findMany({
          include: {
            signatureFields: true,
            formInstances: {
              include: {
                formTemplate: true,
                originator: true,
                signatures: {
                  include: {
                    signerPosition: {
                      include: {
                        department: true,
                      },
                    },
                    signerDepartment: true,
                    assignedUser: true,
                  },
                },
              },
            },
          },
        });
    return formTemplates;
  }

  /**
   * Retrieve a form template by id.
   * @param id the form template id
   * @returns the selected form template, hydrated
   */
  async findOne(id: string) {
    const formTemplate = await this.prisma.formTemplate.findFirstOrThrow({
      where: {
        id: id,
      },
      include: {
        signatureFields: true,
        formInstances: {
          include: {
            formTemplate: true,
            originator: true,
            document: true,
            signatures: {
              include: {
                signerPosition: {
                  include: {
                    department: true,
                  },
                },
                signerDepartment: true,
                assignedUser: true,
              },
            },
          },
        },
      },
    });

    return formTemplate;
  }

  /**
   * Update a form template.
   * @param id the form template id
   * @param updateFormTemplateDto update form template dto
   * @returns the updated form template, hydrated
   */
  async update(id: string, updateFormTemplateDto: UpdateFormTemplateDto) {
    // TODO: Support updating signature fields (updating name/order/position, adding, deleting, etc)
    const updatedFormTemplate = await this.prisma.formTemplate.update({
      where: {
        id: id,
      },
      data: {
        name: updateFormTemplateDto.name,
      },
      include: {
        signatureFields: true,
        formInstances: {
          include: {
            formTemplate: true,
            originator: true,
            document: true,
            signatures: {
              include: {
                signerPosition: {
                  include: {
                    department: true,
                  },
                },
                signerDepartment: true,
                assignedUser: true,
              },
            },
          },
        },
      },
    });
    return updatedFormTemplate;
  }

  /**
   * Remove a form template.
   * @param id the form template id
   */
  async remove(id: string) {
    // TODO: Support cascade delete of dependent entities?
    await this.prisma.formTemplate.delete({
      where: {
        id: id,
      },
    });
  }
}
