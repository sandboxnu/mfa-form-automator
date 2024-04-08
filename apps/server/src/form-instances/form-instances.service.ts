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
import { EmployeesService } from '../employees/employees.service';
import { FormInstance, Prisma } from '@prisma/client';
import { FormTemplateErrorMessage } from '../form-templates/form-templates.errors';
import { FormInstanceErrorMessage } from './form-instance.errors';
import { PositionsErrorMessage } from '../positions/positions.errors';
import { SignatureErrorMessage } from '../signatures/signatures.errors';
import { EmployeeErrorMessage } from '../employees/employees.errors';
import { UserEntity } from '../auth/entities/user.entity';
import { PostmarkService } from '../postmark/postmark.service';

@Injectable()
export class FormInstancesService {
  constructor(
    private prisma: PrismaService,
    private formTemplateService: FormTemplatesService,
    private positionService: PositionsService,
    private employeeService: EmployeesService,
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

    // check that the assigned user is a valid employee and the user's position is a valid position
    for (let i = 0; i < createFormInstanceDto.signatures.length; i++) {
      const userId = createFormInstanceDto.signatures[i].assignedUserId;
      const positionId = createFormInstanceDto.signatures[i].signerPositionId;

      const position = await this.positionService.findOne(positionId);

      if (!position) {
        throw new NotFoundException(PositionsErrorMessage.POSITION_NOT_FOUND);
      }

      const employee = await this.employeeService.findOne(userId);

      if (!employee) {
        throw new NotFoundException(EmployeeErrorMessage.EMPLOYEE_NOT_FOUND);
      }
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
            assignedUser: true,
          },
        },
      },
    });

    // Notify originator of email creation
    // TODO: hyperlink  
    const emailBody: string = `Hi ${newFormInstance.originator.firstName}, you have created a new form: ${newFormInstance.name}.`;
    const emailSubject: string = `Form ${newFormInstance.name} Created`;
    this.postmarkService.sendEmail(
      newFormInstance.originator.email,
      emailSubject,
      emailBody,
    );

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
            assignedUser: true,
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
            assignedUser: true,
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
            assignedUser: true,
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
            assignedUser: true,
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
            assignedUser: true,
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
            assignedUser: true,
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
        signatures: { include: { signerPosition: true, assignedUser: true } },
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
      data: { signed: true },
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
          signatures: { include: { signerPosition: true, assignedUser: true } },
        },
      });

      // Notify originator that form is ready for approval
      const emailBody: string = `Hi ${formInstance.originator.firstName}, your form ${formInstance.name} is completed and is ready for your approval: ${formInstance.name}.`;
      const emailSubject: string = `Form ${formInstance.name} Ready for Approval`;
      this.postmarkService.sendEmail(
        formInstance.originator.email,
        emailSubject,
        emailBody,
      );
    }
    else {
      // Notify next user that form is ready to sign 
      // TODO: hyperlink 
      const nextUserToSignId = formInstance.signatures[signatureIndex + 1];
      const emailBod2y: string = `Hi ${formInstance.originator.firstName}, you have a form ready for your signature: ${formInstance.name}.`;
      const emailSubject2: string = `Form ${formInstance.name} Ready To Sign`;
      this.postmarkService.sendEmail(
        nextUserToSignId.assignedUser!.email,
        emailSubject2,
        emailBod2y,
      );

      // Notify originator that form was signed
      const emailBody: string = `Hi ${formInstance.originator.firstName}, your form ${formInstance.name} has been signed by user: ${employee.firstName} ${employee.lastName}.`;
      const emailSubject: string = `Form ${formInstance.name} signed by ${employee.firstName} ${employee.lastName}`;
      this.postmarkService.sendEmail(
        formInstance.originator.email,
        emailSubject,
        emailBody,
      );
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
