import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmployeesService {
  constructor(
    private prisma: PrismaService, // private configService: ConfigService,
  ) {}

  /**
   * Create a new employee.
   * @param createEmployeeDto create employee dto
   * @returns the created employee, hydrated
   */
  async create(createEmployeeDto: CreateEmployeeDto) {
    // const saltRounds = this.configService.get<number>('SALT_ROUNDS', 10);

    const newEmployee = await this.prisma.employee.create({
      data: {
        firstName: createEmployeeDto.firstName,
        lastName: createEmployeeDto.lastName,
        email: createEmployeeDto.email,
        positionId: createEmployeeDto.positionId,
        pswdHash: await bcrypt.hash(
          createEmployeeDto.password,
          await bcrypt.genSalt(10),
        ),
      },
      include: {
        position: {
          include: {
            department: true,
          },
        },
      },
    });
    newEmployee.pswdHash = null;
    return newEmployee;
  }

  /**
   * Retrieve all employees.
   * @param limit the number of employees we want to retrieve (optional)
   * @returns all employees, hydrated
   */
  async findAll(limit?: number) {
    const employees = await this.prisma.employee.findMany({
      take: limit,
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
            signatures: true,
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
}
