import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new department.
   * @param createDepartmentDto create department dto
   * @returns the created department, hydrated
   */
  async create(createDepartmentDto: CreateDepartmentDto) {
    const newDepartment = await this.prisma.department.create({
      data: {
        name: createDepartmentDto.name,
      },
    });
    return newDepartment;
  }

  /**
   * Retrieve all departments.
   * @param limit the number of departments we want to retrieve (optional)
   * @returns all departments, hydrated
   */
  async findAll(limit?: number) {
    const departments = await this.prisma.department.findMany({
      take: limit,
    });
    return departments;
  }

  /**
   * Retrieve a department by id.
   * @param id the department id
   * @returns the selected department, hydrated
   */
  async findOne(id: string) {
    const department = await this.prisma.department.findFirstOrThrow({
      where: {
        id: id,
      },
    });

    return department;
  }

  /**
   * Retrieve a department by name.
   * @param name the department name
   * @returns the selected department, hydrated
   */
  async findOneByName(name: string, throwOnNotFound = true) {
    const department = await this.prisma.department.findFirst({
      where: {
        name: name,
      },
    });

    if (!department && throwOnNotFound) {
      throw new Error(`Department with name ${name} not found`);
    }

    return department;
  }

  /**
   * Retrieve a department by name or create it if it doesn't exist.
   * @param name the department name
   * @returns the selected or created department, hydrated
   */
  async findOrCreateOneByName(name: string) {
    let department = await this.findOneByName(name, false);

    if (!department) {
      department = await this.create({ name });
    }

    return department;
  }

  /**
   * Update a department.
   * @param id the department id
   * @param updateDepartmentDto update department dto
   * @returns the updated department, hydrated
   */
  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    const updatedDepartment = await this.prisma.department.update({
      where: {
        id: id,
      },
      data: updateDepartmentDto,
    });
    return updatedDepartment;
  }

  /**
   * Remove a department.
   * @param id the department id
   */
  async remove(id: string) {
    await this.prisma.department.delete({
      where: {
        id: id,
      },
    });
  }
}
