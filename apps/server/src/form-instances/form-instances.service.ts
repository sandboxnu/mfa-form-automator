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
import { EmployeeErrorMessage } from '../employees/employees.errors';
import { PositionsErrorMessage } from '../positions/positions.errors';
import { DepartmentsErrorMessage } from '../departments/departments.errors';
import { UserEntity } from '../auth/entities/user.entity';
import { PostmarkService } from '../postmark/postmark.service';
import { PositionsService } from '../positions/positions.service';
import { DepartmentsService } from '../departments/departments.service';
import { SignerType } from '@prisma/client';
import { AssignedGroupErrorMessage } from '../assigned-group/assigned-group.errors';
import { CreateAssignedGroupDto } from '../assigned-group/dto/create-assigned-group.dto';
import { SignFormInstanceDto } from './dto/sign-form-instance.dto';
import { PdfStoreService } from '../pdf-store/pdf-store.service';

@Injectable()
export class FormInstancesService {
  constructor(
    private prisma: PrismaService,
    private formTemplateService: FormTemplatesService,
    private employeeService: EmployeesService,
    private positionsService: PositionsService,
    private departmentsService: DepartmentsService,
    private postmarkService: PostmarkService,
    private pdfStoreService: PdfStoreService,
  ) {}

  async checkValidAssignedGroupsSigner(
    assignedGroups: CreateAssignedGroupDto[],
  ) {
    for (let i = 0; i < assignedGroups.length; i++) {
      const signature = assignedGroups[i];

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
    return true;
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

    // check that the form template and form instance have the same number of groups
    if (
      createFormInstanceDto.assignedGroups.length !==
      formTemplate.fieldGroups.length
    ) {
      throw new BadRequestException(
        FormInstanceErrorMessage.FORM_INSTANCE_INVALID_NUMBER_OF_ASSIGNED_GROUPS,
      );
    }

    // need mapping of each assignedGroup to template boxes
    const fieldGroups = await this.prisma.fieldGroup.findMany({
      where: {
        id: {
          in: formTemplate.fieldGroups.map((group) => group.id),
        },
      },
      include: {
        templateBoxes: true,
      },
    });
    // check that the assigned signer exists for each signature
    await this.checkValidAssignedGroupsSigner(
      createFormInstanceDto.assignedGroups,
    );

    const newFormInstance = await this.prisma.formInstance.create({
      data: {
        name: createFormInstanceDto.name,
        formDocLink: createFormInstanceDto.formDocLink,
        description: createFormInstanceDto.description,
        assignedGroups: {
          create: createFormInstanceDto.assignedGroups.map((assignedGroup) => ({
            ...assignedGroup,
            signerEmployeeList: {
              connect: assignedGroup.signerEmployeeList.map((user) => ({
                id: user.id,
              })),
            },
            instanceBoxes: {
              create: fieldGroups
                .find(
                  (fieldGroup) => fieldGroup.id === assignedGroup.fieldGroupId,
                )
                ?.templateBoxes.map((templateBox) => ({
                  templateBoxId: templateBox.id,
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
            instanceBoxes: true,
            fieldGroup: {
              include: {
                templateBoxes: true,
              },
            },
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

    if (!employee.positionId || !employee.position) {
      throw new BadRequestException(
        EmployeeErrorMessage.EMPLOYEE_NOT_ONBOARDED,
      );
    }

    const formInstances = await this.prisma.formInstance.findMany({
      where: {
        assignedGroups: {
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
            instanceBoxes: true,
            fieldGroup: {
              include: {
                templateBoxes: true,
              },
            },
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
            instanceBoxes: true,
            fieldGroup: {
              include: {
                templateBoxes: true,
              },
            },
          },
        },
      },
    });
    return formInstances;
  }

  /**
   * Find all form instances.
   * @param cursor the form instances to retrieve, paginated
   * @returns all form instances, hydrated
   */
  async findAll(cursor?: number) {
    const formInstances = await this.prisma.formInstance.findMany({
      ...(cursor !== undefined ? { take: 8, skip: cursor * 8 } : {}),
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
            instanceBoxes: true,
            fieldGroup: {
              include: {
                templateBoxes: true,
              },
            },
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
    const formInstance = await this.prisma.formInstance.findFirstOrThrow({
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
            instanceBoxes: true,
            fieldGroup: {
              include: {
                templateBoxes: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
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
    // Use a transaction to ensure all operations are atomic
    return this.prisma.$transaction(async (tx) => {
      // 1. Update the form instance basic properties
      await tx.formInstance.update({
        where: { id },
        data: {
          name: updateFormInstanceDto.name,
          description: updateFormInstanceDto.description,
          formDocLink: updateFormInstanceDto.formDocLink,
        },
      });

      // 2. Handle assigned groups if they're being updated
      if (updateFormInstanceDto.assignedGroups?.length) {
        // First, delete all existing assigned groups if we're replacing them
        // This is more efficient than trying to determine which ones to update vs create
        await tx.assignedGroup.deleteMany({
          where: { formInstanceId: id },
        });

        // Get all required field groups with their template boxes in a single query
        const fieldGroupIds = updateFormInstanceDto.assignedGroups.map(
          (group) => group.fieldGroupId,
        );
        const fieldGroups = await tx.fieldGroup.findMany({
          where: {
            id: {
              in: fieldGroupIds,
            },
          },
          include: {
            templateBoxes: true,
          },
        });

        // Create all the new assigned groups
        for (const assignedGroup of updateFormInstanceDto.assignedGroups) {
          const fieldGroup = fieldGroups.find(
            (fg) => fg.id === assignedGroup.fieldGroupId,
          );

          if (!fieldGroup) {
            throw new NotFoundException(
              `Field group with ID ${assignedGroup.fieldGroupId} not found`,
            );
          }

          // Create the assigned group with its instance boxes
          await tx.assignedGroup.create({
            data: {
              formInstanceId: id,
              fieldGroupId: assignedGroup.fieldGroupId,
              order: assignedGroup.order,
              signerType: assignedGroup.signerType,
              signerEmployeeId: assignedGroup.signerEmployeeId,
              signerPositionId: assignedGroup.signerPositionId,
              signerDepartmentId: assignedGroup.signerDepartmentId,
              signed: false,
              signedDocLink: null,
              signingEmployeeId: null,
              signerEmployeeList: {
                connect: (assignedGroup.signerEmployeeList || []).map(
                  (user) => ({ id: user.id }),
                ),
              },
              instanceBoxes: {
                create: fieldGroup.templateBoxes.map((templateBox) => ({
                  templateBoxId: templateBox.id,
                })),
              },
            },
          });
        }
      }

      // Return the fully hydrated updated form instance
      return tx.formInstance.findFirstOrThrow({
        where: { id },
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
              instanceBoxes: true,
              fieldGroup: {
                include: {
                  templateBoxes: true,
                },
              },
            },
          },
        },
      });
    });
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
        assignedGroups: {
          include: {
            signerPosition: {
              include: {
                department: true,
              },
            },
            signingEmployee: true,
            signerDepartment: true,
            signerEmployee: true,
            signerEmployeeList: true,
            instanceBoxes: true,
            fieldGroup: {
              include: {
                templateBoxes: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Sign a form instance.
   * @param formInstanceId the form instance id
   * @param assignedGroupId the assigned group id id
   * @param currentUser the current user to sign the form
   * @param signFormInstanceDto the sign form instance dto
   * @returns the updated form instance, hydrated
   */
  async signFormInstance(
    formInstanceId: string,
    assignedGroupId: string,
    currentUser: UserEntity,
    signFormInstanceDto: SignFormInstanceDto,
  ): Promise<FormInstance> {
    const formInstance = await this.findOne(formInstanceId);
    if (!formInstance) {
      throw new NotFoundException(
        FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND,
      );
    }

    const employee = await this.prisma.employee.findFirstOrThrow({
      where: { id: currentUser.id },
    });

    if (!employee.positionId) {
      throw new BadRequestException(
        EmployeeErrorMessage.EMPLOYEE_NOT_ONBOARDED,
      );
    }

    const position = await this.prisma.position.findFirstOrThrow({
      where: { id: employee.positionId },
    });

    const assignedGroupIndex = formInstance.assignedGroups.findIndex(
      (assignedGroup) => assignedGroup.id === assignedGroupId,
    );

    if (assignedGroupIndex === -1) {
      throw new NotFoundException(
        AssignedGroupErrorMessage.ASSIGNED_GROUP_NOT_FOUND,
      );
    }

    for (let i = 0; i < assignedGroupIndex; i++) {
      if (!formInstance.assignedGroups[i].signed) {
        throw new BadRequestException(
          AssignedGroupErrorMessage.ASSIGNED_GROUP_NOT_NEXT,
        );
      }
    }
    const assignedGroup = formInstance.assignedGroups[assignedGroupIndex];

    if (
      (assignedGroup.signerType === SignerType.USER &&
        assignedGroup.signerEmployeeId !== employee.id) ||
      (assignedGroup.signerType === SignerType.POSITION &&
        assignedGroup.signerPositionId !== employee.positionId) ||
      (assignedGroup.signerType === SignerType.DEPARTMENT &&
        assignedGroup.signerDepartmentId !== position.departmentId) ||
      (assignedGroup.signerType === SignerType.USER_LIST &&
        assignedGroup.signerEmployeeList &&
        !assignedGroup.signerEmployeeList.some(
          (user) => user.id === employee.id,
        ))
    ) {
      throw new BadRequestException(
        AssignedGroupErrorMessage.EMPLOYEE_CANNOT_SIGN,
      );
    }

    // save signed form to blob storage
    const pdfLink = await this.pdfStoreService.uploadPdf(
      signFormInstanceDto.file.buffer,
      `${formInstanceId}-${assignedGroupId}-${employee.id}`,
    );
    const updatedAssignedGroup = await this.prisma.assignedGroup.update({
      where: { id: assignedGroupId },
      data: {
        signed: true,
        signingEmployeeId: employee.id,
        signedDocLink: pdfLink,
      },
    });

    formInstance.assignedGroups[assignedGroupIndex] = {
      ...formInstance.assignedGroups[assignedGroupIndex],
      ...updatedAssignedGroup,
    };

    const allSigned = formInstance.assignedGroups.every(
      (assignedGroup) => assignedGroup.signed,
    );

    let updatedFormInstance = (await this.findOne(
      formInstanceId,
    )) as FormInstance;

    if (allSigned) {
      updatedFormInstance = await this.prisma.formInstance.update({
        where: { id: formInstanceId },
        data: { completed: true, completedAt: new Date() },
        include: {
          assignedGroups: {
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
      const nextUserToSignId =
        formInstance.assignedGroups[assignedGroupIndex + 1];

      if (
        nextUserToSignId.signerType === SignerType.USER &&
        nextUserToSignId.signerEmployee
      ) {
        this.postmarkService.sendReadyForSignatureToUserEmail(
          nextUserToSignId.signerEmployee.email,
          nextUserToSignId.signerEmployee.firstName,
          formInstance.name,
        );
      } else if (
        nextUserToSignId.signerType === SignerType.POSITION &&
        nextUserToSignId.signerPositionId
      ) {
        this.postmarkService.sendReadyForSignatureToPositionEmail(
          nextUserToSignId.signerPositionId,
          formInstance.name,
        );
      } else if (
        nextUserToSignId.signerType === SignerType.DEPARTMENT &&
        nextUserToSignId.signerDepartmentId
      ) {
        this.postmarkService.sendReadyForSignatureToDepartmentEmail(
          nextUserToSignId.signerDepartmentId,
          formInstance.name,
        );
      } else if (
        nextUserToSignId.signerType === SignerType.USER_LIST &&
        nextUserToSignId.signerEmployeeList
      ) {
        this.postmarkService.sendReadyForSignatureToUserListEmail(
          nextUserToSignId.signerEmployeeList,
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
