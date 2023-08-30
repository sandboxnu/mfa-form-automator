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
        departmentId: createEmployeeDto.departmentId,
        pswdHash: await bcrypt.hash(
          createEmployeeDto.password,
          process.env.SALT_ROUNDS || 10,
        ),
      },
      include: {
        department: true,
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
        department: true,
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
        department: true,
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
        department: true,
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