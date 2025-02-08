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
import { PositionsErrorMessage } from '../positions/positions.errors';
import { DepartmentsErrorMessage } from '../departments/departments.errors';
import { UserEntity } from '../auth/entities/user.entity';
import { PostmarkService } from '../postmark/postmark.service';
import { PositionsService } from '../positions/positions.service';
import { DepartmentsService } from '../departments/departments.service';
import { SignerType } from '@prisma/client';
import { CreateSignatureDto } from '../signatures/dto/create-signature.dto';

@Injectable()
export class FormInstancesService {
  constructor(
    private prisma: PrismaService,
    private formTemplateService: FormTemplatesService,
    private employeeService: EmployeesService,
    private positionsService: PositionsService,
    private departmentsService: DepartmentsService,
    private postmarkService: PostmarkService,
  ) {}

  async checkValidSignaturesSigner(signatures: CreateSignatureDto[]) {
    for (let i = 0; i < signatures.length; i++) {
      const signature = signatures[i];

      if (signature.signerType === SignerType.USER) {
        const employeeId = signature.signerEmployeeId as string;
        try {
          await this.employeeService.findOne(employeeId);
        } catch (e) {
          throw new NotFoundException(EmployeeErrorMessage.EMPLOYEE_NOT_FOUND);
        }
      } else if (signature.signerType === SignerType.POSITION) {
        const positionId = signature.signerPositionId as string;
        try {
          await this.positionsService.findOne(positionId);
        } catch (e) {
          throw new NotFoundException(PositionsErrorMessage.POSITION_NOT_FOUND);
        }
      } else if (signature.signerType === SignerType.DEPARTMENT) {
        const departmentId = signature.signerDepartmentId as string;
        try {
          await this.departmentsService.findOne(departmentId);
        } catch (e) {
          throw new NotFoundException(
            DepartmentsErrorMessage.DEPARTMENT_NOT_FOUND,
          );
        }
      } else if (signature.signerType === SignerType.USER_LIST) {
        // TODO: write query to get all employees in the list
        try {
          await Promise.all(
            signature.signerEmployeeList.map((employee) =>
              this.employeeService.findOne(employee.id),
            ),
          );
        } catch (e) {
          throw new NotFoundException(EmployeeErrorMessage.EMPLOYEE_NOT_FOUND);
        }
      }
    }
  }

  /**
   * Create a new form instance.
   * @param createFormInstanceDto
   */
  async create(createFormInstanceDto: CreateFormInstanceDto) {
    let formTemplate;

    try {
      formTemplate = await this.formTemplateService.findOne(
        createFormInstanceDto.formTemplateId,
      );
    } catch (e) {
      throw new NotFoundException(
        FormTemplateErrorMessage.FORM_TEMPLATE_NOT_FOUND,
      );
    }

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

    // check that the assigned signer exists for each signature
    await this.checkValidSignaturesSigner(createFormInstanceDto.signatures);

    const newFormInstance = await this.prisma.formInstance.create({
      data: {
        name: createFormInstanceDto.name,
        formDocLink: createFormInstanceDto.formDocLink,
        signatures: {
          create: createFormInstanceDto.signatures.map((signature) => ({
            ...signature,
            signerEmployeeList: {
              connect: signature.signerEmployeeList.map((user) => ({
                id: user.id,
              })),
            },
          })),
        },
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
        originator: {
          include: {
            position: {
              include: {
                department: true,
              },
            },
          },
        },
        formTemplate: true,
        signatures: {
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
          },
        },
      },
    });

    // Notify originator of email creation
    this.postmarkService.sendFormCreatedEmail(
      newFormInstance.originator.email,
      `${newFormInstance.originator.firstName} ${newFormInstance.originator.lastName}`,
      newFormInstance.name,
    );

    return newFormInstance;
  }

  /**
   * Find all form instances assigned to an employee.
   * @param employeeId the employee id
   * @returns all form instances assigned to the employee, employees are assigned to a form instance if their id, position id, or department id matches the signer
   */
  async findAssignedTo(employeeId: string) {
    let employee;

    try {
      employee = await this.employeeService.findOne(employeeId);
    } catch (e) {
      throw new NotFoundException(EmployeeErrorMessage.EMPLOYEE_NOT_FOUND);
    }

    const formInstances = await this.prisma.formInstance.findMany({
      where: {
        signatures: {
          some: {
            OR: [
              {
                signerType: SignerType.POSITION,
                signerPositionId: employee.positionId,
              },
              {
                signerType: SignerType.DEPARTMENT,
                signerDepartmentId: employee.position.departmentId,
              },
              {
                signerType: SignerType.USER,
                signerEmployeeId: employeeId,
              },
              {
                signerType: SignerType.USER_LIST,
                signerEmployeeList: {
                  some: {
                    id: employeeId,
                  },
                },
              },
            ],
          },
        },
      },
      include: {
        originator: {
          include: {
            position: {
              include: {
                department: true,
              },
            },
          },
        },
        formTemplate: true,
        signatures: {
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
        originator: {
          include: {
            position: {
              include: {
                department: true,
              },
            },
          },
        },
        formTemplate: true,
        signatures: {
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
        originator: {
          include: {
            position: {
              include: {
                department: true,
              },
            },
          },
        },
        formTemplate: true,
        signatures: {
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
        originator: {
          include: {
            position: {
              include: {
                department: true,
              },
            },
          },
        },
        formTemplate: true,
        signatures: {
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
        originator: {
          include: {
            position: {
              include: {
                department: true,
              },
            },
          },
        },
        formTemplate: true,
        signatures: {
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
            signingEmployee: true,
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
    const formInstance = await this.findOne(formInstanceId);

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
        signature.signerEmployeeId !== employee.id) ||
      (signature.signerType === SignerType.POSITION &&
        signature.signerPositionId !== employee.positionId) ||
      (signature.signerType === SignerType.DEPARTMENT &&
        signature.signerDepartmentId !== position.departmentId) ||
      (signature.signerType === SignerType.USER_LIST &&
        signature.signerEmployeeList &&
        !signature.signerEmployeeList.some((user) => user.id === employee.id))
    ) {
      throw new BadRequestException(SignatureErrorMessage.EMPLOYEE_CANNOT_SIGN);
    }

    const updatedSignature = await this.prisma.signature.update({
      where: { id: signatureId },
      data: { signed: true, signingEmployeeId: employee.id },
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
          signatures: {
            include: { signerPosition: true, signingEmployee: true },
          },
        },
      });

      // Notify originator that form is ready for approval
      this.postmarkService.sendReadyForApprovalEmail(
        formInstance.originator.email,
        `${formInstance.originator.firstName} ${formInstance.originator.lastName}`,
        formInstance.name,
      );
    } else {
      // Notify next user that form is ready to sign
      const nextUserToSignId = formInstance.signatures[signatureIndex + 1];

      if (nextUserToSignId.signerType === SignerType.USER) {
        this.postmarkService.sendReadyForSignatureToUserEmail(
          nextUserToSignId.signerEmployee!.email,
          nextUserToSignId.signerEmployee!.firstName,
          formInstance.name,
        );
      } else if (nextUserToSignId.signerType === SignerType.POSITION) {
        this.postmarkService.sendReadyForSignatureToPositionEmail(
          nextUserToSignId.signerPositionId!,
          formInstance.name,
        );
      } else if (nextUserToSignId.signerType === SignerType.DEPARTMENT) {
        this.postmarkService.sendReadyForSignatureToDepartmentEmail(
          nextUserToSignId.signerDepartmentId!,
          formInstance.name,
        );
      } else if (nextUserToSignId.signerType === SignerType.USER_LIST) {
        this.postmarkService.sendReadyForSignatureToUserListEmail(
          nextUserToSignId.signerEmployeeList!,
          formInstance.name,
        );
      }

      // Notify originator that form was signed
      this.postmarkService.sendSignedEmail(
        formInstance.originator.email,
        `${
          formInstance.originator.firstName +
          ' ' +
          formInstance.originator.lastName
        }`,
        `${employee.firstName} ${employee.lastName}`,
        formInstance.name,
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
    const formInstance = await this.findOne(formInstanceId);

    const currUser = await this.employeeService.findOne(employeeId);

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
