import { Injectable } from '@nestjs/common';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PdfStoreService } from '../pdf-store/pdf-store.service';
import { SortOption } from '../utils';

@Injectable()
export class FormTemplatesService {
  constructor(
    private prisma: PrismaService,
    private pdfStoreService: PdfStoreService,
  ) {}

  private orderBy = (sortBy?: SortOption) => {
    switch (sortBy) {
      case SortOption.CREATED_AT_ASC:
        return { createdAt: 'asc' as const };
      case SortOption.CREATED_AT_DESC:
        return { createdAt: 'desc' as const };
      case SortOption.UPDATED_AT_ASC:
        return { updatedAt: 'asc' as const };
      case SortOption.UPDATED_AT_DESC:
        return { updatedAt: 'desc' as const };
      case SortOption.NAME_ASC:
        return { name: 'asc' as const };
      case SortOption.NAME_DESC:
        return { name: 'desc' as const };
      default:
        return { createdAt: 'desc' as const }; // Default sorting
    }
  };

  /**
   * Create a new form template.
   * @param createFormTemplateDto create form template dto
   * @returns the created employee, hydrated
   */
  async create(createFormTemplateDto: CreateFormTemplateDto) {
    const formTemplatePdfFormDockLink = await this.pdfStoreService.uploadPdf(
      createFormTemplateDto.file.buffer,
      createFormTemplateDto.name,
    );

    const newFormTemplate = await this.prisma.formTemplate.create({
      data: {
        name: createFormTemplateDto.name,
        formDocLink: formTemplatePdfFormDockLink,
        description: createFormTemplateDto.description,
        pageHeight: createFormTemplateDto.pageHeight,
        pageWidth: createFormTemplateDto.pageWidth,
        disabled: createFormTemplateDto.disabled,
        fieldGroups: {
          create: createFormTemplateDto.fieldGroups.map((fieldGroup) => {
            return {
              name: fieldGroup.name,
              order: fieldGroup.order,
              templateBoxes: {
                create: fieldGroup.templateBoxes.map((templateBox) => {
                  return {
                    type: templateBox.type,
                    x_coordinate: templateBox.x_coordinate,
                    y_coordinate: templateBox.y_coordinate,
                    width: templateBox.width,
                    height: templateBox.height,
                    page: templateBox.page,
                  };
                }),
              },
            };
          }),
        },
      },
      include: {
        fieldGroups: {
          include: {
            templateBoxes: true,
          },
        },
      },
    });
    return newFormTemplate;
  }

  /**
   * Retrieve all form templates.
   * @param cursor the form instances to retrieve, paginated
   * @returns all form templates, hydrated
   */
  async findAll({ cursor, sortBy }: { cursor?: number; sortBy?: SortOption }) {
    const formTemplates = await this.prisma.formTemplate
      .findMany({
        ...(cursor !== undefined ? { take: 8, skip: cursor * 8 } : {}),
        orderBy: this.orderBy(sortBy),
        include: {
          fieldGroups: {
            include: {
              templateBoxes: true,
            },
          },
        },
      })
      .then((templates) => templates.filter((item) => !item.disabled));
    return formTemplates;
  }

  /**
   * Find the count of all form templates.
   * @returns the count of all form templates that are not disabled.
   */
  async findAllCount() {
    const formTemplatesCount = await this.prisma.formTemplate.count({
      where: {
        disabled: false,
      },
    });
    return formTemplatesCount;
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
        fieldGroups: {
          include: {
            templateBoxes: true,
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
        description: updateFormTemplateDto.description,
        disabled: updateFormTemplateDto.disabled,
      },
      include: {
        fieldGroups: {
          include: {
            templateBoxes: true,
          },
        },
        formInstances: {
          include: {
            formTemplate: true,
            originator: {
              include: {
                position: {
                  include: {
                    department: true,
                  },
                },
              },
            },
            assignedGroups: {
              include: {
                signerPosition: {
                  include: {
                    department: true,
                  },
                },
                signerDepartment: true,
                signerEmployee: true,
                signerEmployeeList: true,
                signingEmployee: true,
                fieldGroup: {
                  include: {
                    templateBoxes: true,
                  },
                },
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
    await this.prisma.$transaction([
      // Delete TemplateBox records first
      this.prisma.templateBox.deleteMany({
        where: {
          fieldGroup: {
            formTemplateId: id,
          },
        },
      }),
      // Then delete FieldGroup records
      this.prisma.fieldGroup.deleteMany({
        where: {
          formTemplateId: id,
        },
      }),
      // Finally, delete the FormTemplate
      this.prisma.formTemplate.delete({
        where: {
          id,
        },
      }),
    ]);
  }
}
