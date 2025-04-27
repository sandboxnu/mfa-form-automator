import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PositionsService } from '../positions/positions.service';
import { UpdateAssignedGroupSignerDto } from './dto/update-assigned-group-signer.dto';
import { DepartmentsErrorMessage } from '../departments/departments.errors';
import { EmployeeErrorMessage } from '../employees/employees.errors';
import { PositionsErrorMessage } from '../positions/positions.errors';
import { AssignedGroupErrorMessage } from './assigned-group.errors';
import { DepartmentsService } from '../departments/departments.service';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class AssignedGroupService {
  constructor(
    private positionsService: PositionsService,
    private departmentsService: DepartmentsService,
    private employeeService: EmployeesService,
    private prismaService: PrismaService,
  ) {}

  async updateSigner(
    assignedGroupId: string,
    updateAssignedGroupSignerDto: UpdateAssignedGroupSignerDto,
  ) {
    try {
      await this.findOne(assignedGroupId);
    } catch (e) {
      throw new BadRequestException(
        AssignedGroupErrorMessage.ASSIGNED_GROUP_NOT_FOUND,
      );
    }

    switch (updateAssignedGroupSignerDto.signerType) {
      case 'POSITION':
        if (!updateAssignedGroupSignerDto.signerPositionId) {
          throw new BadRequestException(
            AssignedGroupErrorMessage.MISSING_SIGNER,
          );
        }
        try {
          await this.positionsService.findOne(
            updateAssignedGroupSignerDto.signerPositionId,
          );
        } catch (e) {
          throw new BadRequestException(
            PositionsErrorMessage.POSITION_NOT_FOUND,
          );
        }

        return await this.prismaService.assignedGroup.update({
          where: {
            id: assignedGroupId,
          },
          data: {
            signerType: 'POSITION',
            signerPositionId: updateAssignedGroupSignerDto.signerPositionId,
            signerDepartmentId: null,
            signerEmployeeId: null,
            signerEmployeeList: {
              set: [],
            },
          },
          include: {
            signerEmployee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            signerPosition: {
              select: {
                id: true,
                name: true,
                department: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            signerDepartment: {
              select: {
                id: true,
                name: true,
              },
            },
            signerEmployeeList: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });
      case 'DEPARTMENT':
        if (!updateAssignedGroupSignerDto.signerDepartmentId) {
          throw new BadRequestException(
            AssignedGroupErrorMessage.MISSING_SIGNER,
          );
        }
        try {
          await this.departmentsService.findOne(
            updateAssignedGroupSignerDto.signerDepartmentId,
          );
        } catch (e) {
          throw new BadRequestException(
            DepartmentsErrorMessage.DEPARTMENT_NOT_FOUND,
          );
        }

        return await this.prismaService.assignedGroup.update({
          where: {
            id: assignedGroupId,
          },
          data: {
            signerType: 'DEPARTMENT',
            signerPositionId: null,
            signerDepartmentId: updateAssignedGroupSignerDto.signerDepartmentId,
            signerEmployeeId: null,
            signerEmployeeList: {
              set: [],
            },
          },
          include: {
            signerEmployee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            signerPosition: {
              select: {
                id: true,
                name: true,
                department: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            signerDepartment: {
              select: {
                id: true,
                name: true,
              },
            },
            signerEmployeeList: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });
      case 'USER':
        if (!updateAssignedGroupSignerDto.signerEmployeeId) {
          throw new BadRequestException(
            AssignedGroupErrorMessage.MISSING_SIGNER,
          );
        }
        try {
          await this.employeeService.findOne(
            updateAssignedGroupSignerDto.signerEmployeeId,
          );
        } catch (e) {
          throw new BadRequestException(
            EmployeeErrorMessage.EMPLOYEE_NOT_FOUND,
          );
        }

        return await this.prismaService.assignedGroup.update({
          where: {
            id: assignedGroupId,
          },
          data: {
            signerType: 'USER',
            signerPositionId: null,
            signerDepartmentId: null,
            signerEmployeeId: updateAssignedGroupSignerDto.signerEmployeeId,
            signerEmployeeList: {
              set: [],
            },
          },
          include: {
            signerEmployee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            signerPosition: {
              select: {
                id: true,
                name: true,
                department: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            signerDepartment: {
              select: {
                id: true,
                name: true,
              },
            },
            signerEmployeeList: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });
      case 'USER_LIST':
        if (!updateAssignedGroupSignerDto.signerEmployeeList) {
          throw new BadRequestException(
            AssignedGroupErrorMessage.MISSING_SIGNER,
          );
        }

        for (const employee of updateAssignedGroupSignerDto.signerEmployeeList) {
          try {
            await this.employeeService.findOne(employee.id);
          } catch (e) {
            throw new BadRequestException(
              EmployeeErrorMessage.EMPLOYEE_NOT_FOUND,
            );
          }
        }

        return await this.prismaService.assignedGroup.update({
          where: {
            id: assignedGroupId,
          },
          data: {
            signerType: 'USER_LIST',
            signerPositionId: null,
            signerDepartmentId: null,
            signerEmployeeId: null,
            signerEmployeeList: {
              set: updateAssignedGroupSignerDto.signerEmployeeList,
            },
          },
          include: {
            signerEmployee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            signerPosition: {
              select: {
                id: true,
                name: true,
                department: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            signerDepartment: {
              select: {
                id: true,
                name: true,
              },
            },
            signerEmployeeList: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });
      default:
        throw new BadRequestException(
          AssignedGroupErrorMessage.MISSING_SIGNER_TYPE,
        );
    }
  }
  async findOne(id: string) {
    const assignedGroup =
      await this.prismaService.assignedGroup.findFirstOrThrow({
        where: {
          id: id,
        },
        include: {
          signerPosition: {
            select: {
              id: true,
              name: true,
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          signerDepartment: {
            select: {
              id: true,
              name: true,
            },
          },
          signerEmployee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          signerEmployeeList: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          instanceBoxes: true,
        },
      });
    return assignedGroup;
  }
}
