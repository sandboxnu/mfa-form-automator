import { Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SortOption, orderBy } from '../utils';

@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new position.
   * @param createPositionDto create position dto
   * @returns the created position, hydrated
   */
  async create(createPositionDto: CreatePositionDto) {
    const newPosition = await this.prisma.position.create({
      data: {
        name: createPositionDto.name,
        departmentId: createPositionDto.departmentId,
      },
      include: {
        employees: true,
      },
    });
    return newPosition;
  }

  /**
   * Retrieve all positions.
   * @param limit the number of positions we want to retrieve (optional)
   * @param sortBy optional sorting parameter
   * @returns all positions, hydrated
   */
  async findAll({ limit, sortBy }: { limit?: number; sortBy?: SortOption }) {
    const positions = limit
      ? await this.prisma.position.findMany({
          take: limit,
          orderBy: orderBy(sortBy),
          select: {
            id: true,
            name: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
            employees: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        })
      : await this.prisma.position.findMany({
          orderBy: orderBy(sortBy),
          select: {
            id: true,
            name: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
            employees: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });
    return positions;
  }

  /**
   * Retrieve all positions in a department.
   * @param departmentId the department id
   * @returns all positions in the department, hydrated
   */
  async findAllInDepartment(departmentId: string, limit?: number) {
    const positions = await this.prisma.position.findMany({
      take: limit,
      where: {
        departmentId: departmentId,
      },
      include: {
        employees: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return positions;
  }

  /**
   * Retrieve all positions in a department by name.
   * @param department the department name
   * @param limit the number of positions we want to retrieve (optional)
   * @returns all positions in the department, hydrated
   */
  async findAllInDepartmentName(department: string, limit?: number) {
    const positions = await this.prisma.position.findMany({
      take: limit,
      where: {
        department: {
          name: department,
        },
      },
      include: {
        employees: true,
      },
    });

    return positions;
  }

  /**
   * Retrieve all positions with specified ids.
   * @param ids list of position ids
   * @returns all matching positions, hydrated
   */
  async findAllWithIds(ids: string[]) {
    const positions = await this.prisma.position.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        employees: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return positions;
  }

  /**
   * Retrieve a position by id.
   * @param id the position id
   * @returns the selected position, hydrated
   */
  async findOne(id: string) {
    const position = await this.prisma.position.findFirstOrThrow({
      where: {
        id: id,
      },
      include: {
        employees: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return position;
  }

  /**
   * Retrieve a position in a department by id.
   * @param id the position id
   * @param departmentId the department id
   * @returns the selected position, hydrated
   */
  async findOneInDepartment(id: string, departmentId: string) {
    const position = await this.prisma.position.findFirstOrThrow({
      where: {
        id: id,
        departmentId: departmentId,
      },
      include: {
        employees: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return position;
  }

  /**
   * Retrieve a position in a department by name.
   * @param name the position name
   * @param departmentId the department id
   * @param throwOnNotFound whether to throw an error if the position is not found
   * @returns the selected position, hydrated
   */
  async findOneByNameInDepartment(
    name: string,
    departmentId: string,
    throwOnNotFound = true,
  ) {
    const position = await this.prisma.position.findFirst({
      where: {
        name: name,
        departmentId: departmentId,
      },
      include: {
        employees: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!position && throwOnNotFound) {
      throw new Error(
        `Position with name ${name} not found in department ${departmentId}`,
      );
    }

    return position;
  }

  /**
   * Retrieve a position by name.
   * @param name the position name
   * @returns the selected position, hydrated
   */
  async findOrCreateOneInDepartment(id: string, departmentId: string) {
    let position = await this.findOneInDepartment(id, departmentId);

    if (!position) {
      position = await this.create({ name: id, departmentId });
    }

    return position;
  }

  /**
   * Retrieve a position by name or create it if it doesn't exist.
   * @param name the position name
   * @param departmentId the department id
   * @returns the position if it exists, otherwise create it
   */
  async findOrCreateOneByNameInDepartment(name: string, departmentId: string) {
    let position = await this.findOneByNameInDepartment(
      name,
      departmentId,
      false,
    );

    if (!position) {
      position = await this.create({ name, departmentId });
    }

    return position;
  }

  /**
   * Update a position.
   * @param id the position id
   * @param updatePositionDto update position dto
   * @returns the updated position, hydrated
   */
  async update(id: string, updatePositionDto: UpdatePositionDto) {
    const updatedPosition = this.prisma.position.update({
      where: {
        id: id,
      },
      data: updatePositionDto,
      include: {
        employees: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return updatedPosition;
  }

  /**
   * Remove a position.
   * @param id the position id
   */
  async remove(id: string) {
    await this.prisma.position.delete({
      where: {
        id: id,
      },
    });
  }
}
