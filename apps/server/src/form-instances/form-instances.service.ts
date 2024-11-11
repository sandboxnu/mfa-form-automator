import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFormInstanceDto } from './dto/create-form-instance.dto';
import { UpdateFormInstanceDto } from './dto/update-form-instance.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FormTemplatesService } from '../form-templates/form-templates.service';
import { EmployeesService } from '../employees/employees.service';
import { FormInstance } from '@prisma/client';
import { FormTemplateErrorMessage } from '../form-templates/form-templates.errors';
import { FormInstanceErrorMessage } from './form-instance.errors';
import { SignatureErrorMessage } from '../signatures/signatures.errors';
import { EmployeeErrorMessage } from '../employees/employees.errors';
import { UserEntity } from '../auth/entities/user.entity';
import { PostmarkService } from '../postmark/postmark.service';
import { SignerType } from '@prisma/client';

@Injectable()
export class FormInstancesService {
  constructor(
    private prisma: PrismaService,
    private formTemplateService: FormTemplatesService,
    private employeeService: EmployeesService,
    private postmarkService: PostmarkService,
  ) {}

  /**
   * Create a new form instance.
   * @param createFormInstanceDto
   */
  async create(createFormInstanceDto: CreateFormInstanceDto) {
    const formTemplate = await this.formTemplateService.findOne(
      createFormInstanceDto.formTemplateId,
    );

    if (!formTemplate) {
      throw new NotFoundException(
        FormTemplateErrorMessage.FORM_TEMPLATE_NOT_FOUND,
      );
    }

    // check that the form template and form instance have the same number of signatures
    if (
      createFormInstanceDto.signatures.length !==
      formTemplate.signatureFields.length
    ) {
      throw new BadRequestException(
        FormInstanceErrorMessage.FORM_INSTANCE_INVALID_NUMBER_OF_SIGNATURES,
      );
    }

    const newFormInstance = await this.prisma.formInstance.create({
      data: {
        name: createFormInstanceDto.name,
        formDocLink: createFormInstanceDto.formDocLink,
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
            signerDepartment: true,
            assignedUser: true,
          },
        },
      },
    });

    // Notify originator of email creation
    const emailBody: string = `Hi ${newFormInstance.originator.firstName}, you have created a new form: ${newFormInstance.name}.`;
    const emailSubject: string = `Form ${newFormInstance.name} Created`;
    this.postmarkService.sendEmail(
      newFormInstance.originator.email,
      emailSubject,
      emailBody,
    );

    return newFormInstance;
  }

  /**
   * Find all form instances assigned to an employee.
   * @param employeeId the employee id
   * @returns all form instances assigned to the employee, employees are assigned to a form instance if their id, position id, or department id matches the signer
   */
  async findAssignedTo(employeeId: string) {
    const employee = await this.employeeService.findOne(employeeId);

    if (!employee) {
      throw new NotFoundException(EmployeeErrorMessage.EMPLOYEE_NOT_FOUND);
    }

    const formInstances = await this.prisma.formInstance.findMany({
      where: {
        signatures: {
          some: {
            OR: [
              {
                signerType: 'POSITION',
                signerPositionId: employee.positionId,
              },
              {
                signerType: 'DEPARTMENT',
                signerDepartmentId: employee.position.departmentId,
              },
              {
                signerType: 'USER',
                assignedUserId: employeeId,
              },
            ],
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
            signerDepartment: true,
            assignedUser: true,
          },
        },
      },
    });

    return formInstances;
  }

  /**
   * Finds all form instances created by an employee.
   * @param employeeId the employee id
   * @returns all form instances created by the employee
   */
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
            signerDepartment: true,
            assignedUser: true,
          },
        },
      },
    });
    return formInstances;
  }

  /**
   * Find all form instances.
   * @param limit the number of form instances to retrieve
   * @returns all form instances, hydrated
   */
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
            signerDepartment: true,
            assignedUser: true,
          },
        },
      },
    });
    return formInstances;
  }

  /**
   * Find a form instance by id.
   * @param id the form instance id
   * @returns the selected form instance, hydrated
   */
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
            signerDepartment: true,
            assignedUser: true,
          },
        },
      },
    });
    return formInstance;
  }

  /**
   * Update a form instance.
   * @param id the form instance id
   * @param updateFormInstanceDto the updated form instance
   * @returns the updated form instance, hydrated
   */
  async update(id: string, updateFormInstanceDto: UpdateFormInstanceDto) {
    const updatedFormInstance = this.prisma.formInstance.update({
      where: {
        id: id,
      },
      data: {
        name: updateFormInstanceDto.name,
        formDocLink: updateFormInstanceDto.formDocLink,
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
            signerDepartment: true,
            assignedUser: true,
          },
        },
      },
    });
    return updatedFormInstance;
  }

  /**
   * Remove a form instance.
   * @param id the form instance id
   */
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

  /**
   * Sign a form instance.
   * @param formInstanceId the form instance id
   * @param signatureId the signature id
   * @param currentUser the current user to sign the form
   * @returns the updated form instance, hydrated
   */
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

    const position = await this.prisma.position.findFirstOrThrow({
      where: { id: employee.positionId },
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
    const signature = formInstance.signatures[signatureIndex];

    if (
      (signature.signerType === SignerType.USER &&
        signature.assignedUserId !== employee.id) ||
      (signature.signerType === SignerType.POSITION &&
        signature.signerPositionId !== employee.positionId) ||
      (signature.signerType === SignerType.DEPARTMENT &&
        signature.signerDepartmentId !== position.departmentId)
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
    } else {
      // Notify next user that form is ready to sign
      const nextUserToSignId = formInstance.signatures[signatureIndex + 1];

      if (nextUserToSignId.signerType === SignerType.USER) {
        const emailBod2y: string = `Hi ${formInstance.originator.firstName}, you have a form ready for your signature: ${formInstance.name}.`;
        const emailSubject2: string = `Form ${formInstance.name} Ready To Sign`;
        this.postmarkService.sendEmail(
          nextUserToSignId.assignedUser!.email,
          emailSubject2,
          emailBod2y,
        );
      } else {
        // TODO: Implement sending email to department or position
      }

      // Notify originator that form was signed
      const emailBody: string = `Hi ${formInstance.originator.firstName}, your form ${formInstance.name} has been signed by user: ${employee.firstName} ${employee.lastName}.`;
      const emailSubject: string = `Form ${formInstance.name} Signed By ${employee.firstName} ${employee.lastName}`;
      this.postmarkService.sendEmail(
        formInstance.originator.email,
        emailSubject,
        emailBody,
      );
    }

    return updatedFormInstance;
  }

  /**
   * Mark a form instance as completed.
   * @param employeeId the employee id marking the form as completed
   * @param formInstanceId the form instance id to mark as completed
   * @returns the updated form instance, hydrated
   */
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

    if (!isOriginator) {
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
