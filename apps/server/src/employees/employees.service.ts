import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from '@server/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Employee } from '@prisma/client';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    let newEmployee = await this.prisma.employee.create({
      data: {
        firstName: createEmployeeDto.firstName,
        lastName: createEmployeeDto.lastName,
        email: createEmployeeDto.email,
        pswdHash: await bcrypt.hash(
          createEmployeeDto.password,
          process.env.SALT_ROUNDS || 10,
        ),
      },
    });
    newEmployee.pswdHash = null;
    return newEmployee;
  }

  async findAll(limit: number): Promise<Employee[]> {
    let employees = await this.prisma.employee.findMany({ take: limit });
    return employees;
  }

  async findOne(id: string): Promise<Employee> {
    let employee = await this.prisma.employee.findFirstOrThrow({
      where: {
        id: id,
      },
    });
    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    let updatedEmployee = this.prisma.employee.update({
      where: {
        id: id,
      },
      data: updateEmployeeDto,
    });
    return updatedEmployee;
  }

  async remove(id: string) {
    await this.prisma.employee.delete({
      where: {
        id: id,
      },
    });
  }
}
