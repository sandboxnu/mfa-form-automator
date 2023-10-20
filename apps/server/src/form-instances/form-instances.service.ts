import { Injectable } from '@nestjs/common';
import { CreateFormInstanceDto } from './dto/create-form-instance.dto';
import { UpdateFormInstanceDto } from './dto/update-form-instance.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FormTemplatesService } from '../form-templates/form-templates.service';

@Injectable()
export class FormInstancesService {
  constructor(
    private prisma: PrismaService,
    private formTemplateService: FormTemplatesService,
  ) {}

  /**
   * Create a new form instance.
   * @param createFormInstanceDto
   */
  async create(createFormInstanceDto: CreateFormInstanceDto) {
    // TODO: Add validation before creating new form instance

    const formTemplate = await this.formTemplateService.findOne(
      createFormInstanceDto.formTemplateId,
    );
    const newFormInstance = await this.prisma.formInstance.create({
      data: {
        name: createFormInstanceDto.name,
        formDocLink: formTemplate.formDocLink,
        signatures: { create: createFormInstanceDto.signatures },
        originator: {
          connect: {
            id: createFormInstanceDto.originatorId,
          },
        },
        formTemplate: {
          connect: {
            id: createFormInstanceDto.formTemplateId,
          },
        },
      },
      include: {
        originator: true,
        formTemplate: true,
        signatures: {
          include: {
            signerPosition: {
              include: {
                department: true,
              },
            },
            userSignedBy: true,
          },
        },
      },
    });
    return newFormInstance;
  }

  async findAssignedTo(employeeId: string) {
    const formInstances = await this.prisma.formInstance.findMany({
      where: {
        signatures: {
          some: {
            signerPosition: {
              employees: {
                some: {
                  id: {
                    equals: employeeId,
                  },
                },
              },
            },
          },
        },
      },
      include: {
        originator: true,
        formTemplate: true,
        signatures: {
          include: {
            signerPosition: {
              include: {
                department: true,
              },
            },
            userSignedBy: true,
          },
        },
      },
    });
    return formInstances;
  }

  async findCreatedBy(employeeId: string) {
    const formInstances = await this.prisma.formInstance.findMany({
      where: {
        originatorId: {
          equals: employeeId,
        },
      },
      include: {
        originator: true,
        formTemplate: true,
        signatures: {
          include: {
            signerPosition: {
              include: {
                department: true,
              },
            },
            userSignedBy: true,
          },
        },
      },
    });
    return formInstances;
  }

  async findAll(limit?: number) {
    const formInstances = await this.prisma.formInstance.findMany({
      take: limit,
      include: {
        originator: true,
        formTemplate: true,
        signatures: {
          include: {
            signerPosition: {
              include: {
                department: true,
              },
            },
            userSignedBy: true,
          },
        },
      },
    });
    return formInstances;
  }

  async findOne(id: string) {
    const formInstance = await this.prisma.formInstance.findFirst({
      where: {
        id: id,
      },
      include: {
        originator: true,
        formTemplate: true,
        signatures: {
          include: {
            signerPosition: {
              include: {
                department: true,
              },
            },
            userSignedBy: true,
          },
        },
      },
    });
    return formInstance;
  }

  async update(id: string, updateFormInstanceDto: UpdateFormInstanceDto) {
    // TODO: How do we support updating signatures?

    const updatedFormInstance = this.prisma.formInstance.update({
      where: {
        id: id,
      },
      data: {
        name: updateFormInstanceDto.name,
        // signatures: { create: updateFormInstanceDto.signatures },
      },
      include: {
        originator: true,
        formTemplate: true,
        signatures: {
          include: {
            signerPosition: {
              include: {
                department: true,
              },
            },
            userSignedBy: true,
          },
        },
      },
    });
    return updatedFormInstance;
  }

  async remove(id: string) {
    await this.prisma.formInstance.delete({
      where: {
        id: id,
      },
      include: {
        originator: true,
        formTemplate: true,
        signatures: {
          include: {
            signerPosition: {
              include: {
                department: true,
              },
            },
            userSignedBy: true,
          },
        },
      },
    });
  }
}
