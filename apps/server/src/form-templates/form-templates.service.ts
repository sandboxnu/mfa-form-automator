import { Injectable } from '@nestjs/common';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PdfStoreService } from '../pdf-store/pdf-store.service';

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
    const formTemplatePdfFormDockLink = await this.pdfStoreService.uploadPdf(
      createFormTemplateDto.file.buffer,
      createFormTemplateDto.name,
    );

    const newFormTemplate = await this.prisma.formTemplate.create({
      data: {
        name: createFormTemplateDto.name,
        formDocLink: formTemplatePdfFormDockLink,
        description: createFormTemplateDto.description,
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
        })
      : await this.prisma.formTemplate.findMany({
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
    // TODO: Support cascade delete of dependent entities?
    await this.prisma.formTemplate.delete({
      where: {
        id: id,
      },
    });
  }
}
