import { Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PrismaService } from '../prisma/prisma.service';

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
   * @returns all positions, hydrated
   */
  async findAll(limit?: number) {
    const positions = limit
      ? await this.prisma.position.findMany({
          take: limit,
          include: {
            employees: true,
          },
        })
      : await this.prisma.position.findMany({
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
        employees: true,
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
        employees: true,
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
        employees: true,
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
        employees: true,
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
