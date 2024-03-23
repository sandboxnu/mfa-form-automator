import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFormInstanceDto } from './dto/create-form-instance.dto';
import { UpdateFormInstanceDto } from './dto/update-form-instance.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FormTemplatesService } from '../form-templates/form-templates.service';
import { PositionsService } from '../positions/positions.service';
import { FormInstance, Prisma } from '@prisma/client';
import { FormTemplateErrorMessage } from '../form-templates/form-templates.errors';
import { FormInstanceErrorMessage } from './form-instance.errors';
import { PositionsErrorMessage } from '../positions/positions.errors';
import { SignatureErrorMessage } from '../signatures/signatures.errors';
import { EmployeeErrorMessage } from '../employees/employees.errors';
import { UserEntity } from '../auth/entities/user.entity';

@Injectable()
export class FormInstancesService {
  constructor(
    private prisma: PrismaService,
    private formTemplateService: FormTemplatesService,
    private positionService: PositionsService,
    private postmarkService: PostmarkService,
  ) { }

  /**
   * Create a new form instance.
   * @param createFormInstanceDto
   */
  async create(createFormInstanceDto: CreateFormInstanceDto) {
    const formTemplate = await (async () => {
      try {
        return await this.formTemplateService.findOne(
          createFormInstanceDto.formTemplateId,
        );
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') {
            return null;
          }
        }
        throw e;
      }
    })();

    // form template should be valid
    if (formTemplate == null) {
      throw Error(FormTemplateErrorMessage.FORM_TEMPLATE_NOT_FOUND);
    }

    // number of signatures to be created should be equal to the number of
    // signature fields on the form template
    if (
      formTemplate.signatureFields.length !=
      createFormInstanceDto.signatures.length
    ) {
      throw Error(
        FormInstanceErrorMessage.FORM_INSTANCE_INVALID_NUMBER_OF_SIGNATURES,
      );
    }

    // all positions in signatures should be valid
    const positionIds = new Set(
      createFormInstanceDto.signatures.map(
        (signature) => signature.signerPositionId,
      ),
    );
    const positions = await this.positionService.findAllWithIds(
      createFormInstanceDto.signatures.map(
        (signature) => signature.signerPositionId,
      ),
    );
    if (positions.length != positionIds.size) {
      throw Error(PositionsErrorMessage.POSITION_NOT_FOUND);
    }

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

  async signFormInstance(
    formInstanceId: string,
    signatureId: string,
    currentUser: UserEntity,
  ) {
    const formInstance = await this.prisma.formInstance.findUnique({
      where: { id: formInstanceId },
      include: {
        signatures: { include: { signerPosition: true, userSignedBy: true } },
        originator: true,
      },
    });

    if (!formInstance) {
      throw new NotFoundException(
        FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND,
      );
    }

    const employee = await this.prisma.employee.findFirstOrThrow({
      where: { id: currentUser.id },
    });

    const signatureIndex = formInstance.signatures.findIndex(
      (sig) => sig.id === signatureId,
    );

    if (signatureIndex === -1) {
      throw new NotFoundException(SignatureErrorMessage.SIGNATURE_NOT_FOUND);
    }

    for (let i = 0; i < signatureIndex; i++) {
      if (!formInstance.signatures[i].signed) {
        throw new BadRequestException(SignatureErrorMessage.SIGNATURE_NOT_NEXT);
      }
    }

    if (
      employee.positionId !=
      formInstance.signatures[signatureIndex].signerPositionId
    ) {
      throw new BadRequestException(SignatureErrorMessage.EMPLOYEE_CANNOT_SIGN);
    }

    const updatedSignature = await this.prisma.signature.update({
      where: { id: signatureId },
      data: { signed: true, userSignedById: currentUser.id },
    });

    formInstance.signatures[signatureIndex] = {
      ...formInstance.signatures[signatureIndex],
      ...updatedSignature,
    };

    const allSigned = formInstance.signatures.every((sig) => sig.signed);

    let updatedFormInstance = (await this.findOne(
      formInstanceId,
    )) as FormInstance;

    if (allSigned) {
      updatedFormInstance = await this.prisma.formInstance.update({
        where: { id: formInstanceId },
        data: { completed: true, completedAt: new Date() },
        include: {
          signatures: { include: { signerPosition: true, userSignedBy: true } },
        },
      });
    }

    return updatedFormInstance;
  }

  async markFormInstanceAsCompleted(
    employeeId: string,
    formInstanceId: string,
  ) {
    const formInstance = await this.prisma.formInstance.findUnique({
      where: { id: formInstanceId },
      include: {
        originator: { include: { position: true } },
      },
    });

    const currUser = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: { position: true },
    });

    if (!formInstance) {
      throw new NotFoundException(
        FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND,
      );
    }

    if (!currUser) {
      throw new NotFoundException(EmployeeErrorMessage.EMPLOYEE_NOT_FOUND);
    }

    const isOriginator = formInstance.originator.id === employeeId;
    const isAdminInSameDepartment =
      currUser.isAdmin &&
      currUser.position.departmentId ===
      formInstance.originator.position.departmentId;

    if (!isOriginator && !isAdminInSameDepartment) {
      throw new BadRequestException(
        FormInstanceErrorMessage.FORM_INSTANCE_INVALID_MARKED_COMPLETED,
      );
    }

    const updatedFormInstance = await this.prisma.formInstance.update({
      where: { id: formInstanceId },
      data: { markedCompleted: true, markedCompletedAt: new Date() },
    });

    return updatedFormInstance;
  }
}
