import { Inject, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ValidateEmployeeHandler } from './validate-employee/ValidateEmployeeHandlerInterface';
import { EmployeeErrorMessage } from './employees.errors';
import { orderBy, SortOption } from '../utils';

@Injectable()
export class EmployeesService {
  constructor(
    @Inject('ValidateEmployeeHandler')
    private validateEmployeeHandler: ValidateEmployeeHandler,
    private prisma: PrismaService,
  ) {}

  /**
   * Creates and validates a new employee.
   * @param createEmployeeDto create employee dto
   * @returns the created employee, hydrated
   * @throws
   */
  async createAndValidate(createEmployeeDto: CreateEmployeeDto) {
    if (
      !(await this.validateEmployeeHandler.validateEmployee(
        createEmployeeDto.accessToken,
        createEmployeeDto.email,
      ))
    ) {
      throw new Error(EmployeeErrorMessage.EMPLOYEE_NOT_FOUND_IN_AUTH_PROVIDER);
    }

    const newEmployee = await this.create(createEmployeeDto);
    return newEmployee;
  }

  /**
   * Create a new employee.
   * @param createEmployeeDto create employee dto
   * @returns the created employee, hydrated
   */
  async create(createEmployeeDto: CreateEmployeeDto) {
    // manually make sure email is unique (since we are not using unique constraint in the database due to disabled flag)
    const existingEmployee = await this.prisma.employee.findFirst({
      where: {
        email: createEmployeeDto.email,
        isActive: true,
      },
    });

    if (existingEmployee) {
      throw new Error(EmployeeErrorMessage.EMPLOYEE_EMAIL_ALREADY_EXISTS);
    }

    const newEmployee = await this.prisma.employee.create({
      data: {
        firstName: createEmployeeDto.firstName,
        lastName: createEmployeeDto.lastName,
        email: createEmployeeDto.email,
        positionId: createEmployeeDto.positionId,
        scope: createEmployeeDto.scope,
        isActive: true,
      },
      include: {
        position: {
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
      },
    });
    return newEmployee;
  }

  /**
   * Retrieve all employees.
   * @param limit the number of employees we want to retrieve (optional)
   * @returns all employees, hydrated
   */
  async findAll({ limit, sortBy }: { limit?: number; sortBy?: SortOption }) {
    const employees = limit
      ? await this.prisma.employee.findMany({
          take: limit,
          orderBy: orderBy(sortBy, true),
          where: {
            isActive: true,
          } as any,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        })
      : await this.prisma.employee.findMany({
          orderBy: orderBy(sortBy, true),
          where: {
            isActive: true,
          } as any,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        });

    return employees;
  }

  async findAllSecure({
    limit,
    sortBy,
  }: {
    limit?: number;
    sortBy?: SortOption;
  }) {
    const employees = await this.prisma.employee.findMany({
      ...(limit ? { take: limit } : {}),
      orderBy: orderBy(sortBy, true),
      where: {
        isActive: true,
      } as any,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        position: {
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
        scope: true,
      },
    });
    return employees;
  }

  /**
   * Retrieve an employee by id.
   * @param id the employee id
   * @returns the selected employee, hydrated
   */
  async findOne(id: string) {
    const employee = await this.prisma.employee.findFirstOrThrow({
      where: {
        id: id,
        isActive: true,
      },
      include: {
        position: {
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
      },
    });
    return employee;
  }

  /**
   * Retrieve an employee by id and refresh token.
   * @param id the employee id
   * @param refreshToken the refresh token
   * @returns the selected employee, hydrated
   */
  async findOneWithRefresh(id: string, refreshToken: string) {
    const employee = await this.prisma.employee.findFirstOrThrow({
      where: {
        AND: [{ id: id }, { refreshToken: refreshToken }],
        isActive: true,
      },
      include: {
        position: {
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
      },
    });
    return employee;
  }

  /**
   * Retrieve an employee by email, for authentication purposes.
   * @param email the employee email
   * @returns the selected employee, hydrated
   */
  async findOneByEmailAuth(email: string) {
    const employee = await this.prisma.employee.findFirstOrThrow({
      where: {
        email: email,
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        position: {
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
        pswdHash: true,
        scope: true,
      },
    });
    return employee;
  }

  /**
   * Update an employee.
   * @param id the employee id
   * @param updateEmployeeDto update employee dto
   * @returns the updated employee, hydrated
   */
  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const updatedEmployee = this.prisma.employee.update({
      where: {
        id: id,
      },
      data: updateEmployeeDto,
      include: {
        position: {
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
      },
    });
    return updatedEmployee;
  }

  /**
   * Remove an employee.
   * @param id the employee id
   */
  async remove(id: string) {
    return await this.prisma.employee.delete({
      where: {
        id: id,
      },
    });
  }

  /**
   * Deactivate an employee by setting isActive to false
   * @param id the employee id
   */
  async deactivate(id: string) {
    return await this.prisma.employee.update({
      where: {
        id: id,
      },
      data: {
        isActive: false,
      } as any,
    });
  }

  /**
   * Set an employee's refresh token.
   * @param id the employee id
   * @param refreshToken the jwt refresh token
   */
  async setRefreshToken(id: string, refreshToken: string) {
    const updatedEmployee = this.prisma.employee.update({
      where: {
        id: id,
      },
      data: {
        refreshToken: refreshToken,
      },
      include: {
        position: {
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
      },
    });
    return updatedEmployee;
  }
}
