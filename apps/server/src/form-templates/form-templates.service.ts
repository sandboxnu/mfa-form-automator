import { Injectable } from '@nestjs/common';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PdfStoreService } from '../pdf-store/pdf-store.service';
import { FormTemplateErrorMessage } from './form-templates.errors';
import { SortOption, orderBy } from '../utils';
import { CreateFieldGroupDto } from '../field-group/dto/create-field-group.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FormTemplatesService {
  constructor(
    private prisma: PrismaService,
    private pdfStoreService: PdfStoreService,
  ) {}

  /**
   * Create a new form template.
   * @param createFormTemplateDto create form template dto
   * @returns the created employee, hydrated
   */
  async create(createFormTemplateDto: CreateFormTemplateDto) {
    const existingFormTemplate = await this.prisma.formTemplate.findFirst({
      where: {
        name: createFormTemplateDto.name,
        disabled: false,
      },
    });
    if (existingFormTemplate) {
      throw new Error(FormTemplateErrorMessage.FORM_TEMPLATE_EXISTS);
    }

    const formTemplatePdfFormDocLink = await this.pdfStoreService.uploadPdf(
      createFormTemplateDto.file.buffer,
      createFormTemplateDto.name + '_' + uuid(),
    );

    const newFormTemplate = await this.prisma.formTemplate.create({
      data: {
        name: createFormTemplateDto.name,
        formDocLink: formTemplatePdfFormDocLink,
        description: createFormTemplateDto.description,
        pageHeight: Math.floor(createFormTemplateDto.pageHeight),
        pageWidth: Math.floor(createFormTemplateDto.pageWidth),
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
        orderBy: orderBy(sortBy),
        include: {
          fieldGroups: {
            include: {
              templateBoxes: true,
            },
            orderBy: {
              order: 'asc',
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
          orderBy: {
            order: 'asc',
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
    if (updateFormTemplateDto.name) {
      const existingFormTemplate = await this.prisma.formTemplate.findFirst({
        where: {
          name: updateFormTemplateDto.name,
          disabled: false,
        },
      });
      if (existingFormTemplate && existingFormTemplate.id !== id) {
        throw new Error(FormTemplateErrorMessage.FORM_TEMPLATE_EXISTS);
      }
    }

    // we need to create a new form template to mimic updating the old template
    // while preserving existing form instances that depend on this form template's structure
    // after creating the new template, disable the old template.
    if (
      updateFormTemplateDto.fieldGroups &&
      updateFormTemplateDto.fieldGroups !== undefined &&
      updateFormTemplateDto.fieldGroups?.length > 0
    ) {
      const pseudoUpdatedFormTemplate = await this.prisma.$transaction(
        async (tx) => {
          const existingFormTemplate = await tx.formTemplate.findFirstOrThrow({
            where: {
              id: id,
            },
            include: {
              fieldGroups: {
                include: {
                  templateBoxes: true,
                },
                orderBy: {
                  order: 'asc',
                },
              },
            },
          });

          // make sure that the new field groups are different from the existing ones, and that all properties are the same
          const areFieldGroupsEqual = (
            newFieldGroups: CreateFieldGroupDto[],
            existingFieldGroups: CreateFieldGroupDto[],
          ) => {
            if (newFieldGroups.length !== existingFieldGroups.length) {
              return false;
            }
            return newFieldGroups.every((newGroup, index) => {
              const existingGroup = existingFieldGroups[index];
              return (
                newGroup.name === existingGroup.name &&
                newGroup.order === existingGroup.order &&
                newGroup.templateBoxes.length ===
                  existingGroup.templateBoxes.length &&
                newGroup.templateBoxes.every((newBox, boxIndex) => {
                  const existingBox = existingGroup.templateBoxes[boxIndex];
                  return (
                    newBox.type === existingBox.type &&
                    newBox.x_coordinate === existingBox.x_coordinate &&
                    newBox.y_coordinate === existingBox.y_coordinate &&
                    newBox.width === existingBox.width &&
                    newBox.height === existingBox.height &&
                    newBox.page === existingBox.page
                  );
                })
              );
            });
          };

          if (
            areFieldGroupsEqual(
              updateFormTemplateDto.fieldGroups ?? [],
              existingFormTemplate.fieldGroups,
            )
          ) {
            // if only updating name, description, or disabled, we can edit the existing template
            const updatedFormTemplate = await tx.formTemplate.update({
              where: { id },
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
                  orderBy: {
                    order: 'asc',
                  },
                },
              },
            });
            return updatedFormTemplate;
          }

          const newFormTemplate = await tx.formTemplate.create({
            data: {
              name: updateFormTemplateDto.name ?? existingFormTemplate.name,
              description:
                updateFormTemplateDto.description ??
                existingFormTemplate.description,
              // reuse the existing base pdf url
              formDocLink: existingFormTemplate.formDocLink,
              pageHeight: Math.floor(existingFormTemplate.pageHeight),
              pageWidth: Math.floor(existingFormTemplate.pageWidth),
              fieldGroups: {
                create: updateFormTemplateDto.fieldGroups?.map((fieldGroup) => {
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
                orderBy: {
                  order: 'asc',
                },
              },
            },
          });
          await tx.formTemplate.update({
            where: { id: existingFormTemplate.id },
            data: {
              disabled: true,
            },
          });

          return newFormTemplate;
        },
      );
      return pseudoUpdatedFormTemplate;
    } else {
      // if only updating name, description, or disabled, we can edit the existing template
      const updatedFormTemplate = await this.prisma.$transaction(async (tx) => {
        return tx.formTemplate.update({
          where: { id },
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
              orderBy: {
                order: 'asc',
              },
            },
          },
        });
      });
      return updatedFormTemplate;
    }
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
