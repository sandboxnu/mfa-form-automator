import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new employee.
   * @param createEmployeeDto create employee dto
   * @returns the created employee, hydrated
   */
  async create(createEmployeeDto: CreateEmployeeDto) {
    const newEmployee = await this.prisma.employee.create({
      data: {
        firstName: createEmployeeDto.firstName,
        lastName: createEmployeeDto.lastName,
        email: createEmployeeDto.email,
        pswdHash: await bcrypt.hash(
          createEmployeeDto.password,
          await bcrypt.genSalt(Number(process.env.SALT_ROUNDS) || 10),
        ),
        scope: createEmployeeDto.scope,
      },
      include: {
        position: {
          include: {
            department: true,
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
  async findAll(limit?: number) {
    const employees = limit
      ? await this.prisma.employee.findMany({
          take: limit,
          include: {
            position: {
              include: {
                department: true,
              },
            },
          },
        })
      : await this.prisma.employee.findMany({
          include: {
            position: {
              include: {
                department: true,
              },
            },
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
      },
      include: {
        position: {
          include: {
            department: true,
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
      },
      include: {
        position: {
          include: {
            department: true,
          },
        },
      },
    });
    return employee;
  }

  /**
   * Retrieve an employee by email.
   * @param email the employee email
   * @returns the selected employee, hydrated
   */
  async findOneByEmail(email: string) {
    const employee = await this.prisma.employee.findFirstOrThrow({
      where: {
        email: email,
      },
      include: {
        position: {
          include: {
            department: true,
          },
        },
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
          include: {
            department: true,
            assignedGroups: true,
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
    await this.prisma.employee.delete({
      where: {
        id: id,
      },
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
          include: {
            department: true,
          },
        },
      },
    });
    return updatedEmployee;
  }
}
