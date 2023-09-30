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
        // employeeId: createPositionDto.employeeId,
        // signatureFields: { create: createFormTemplateDto.signatureFields },
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
    const positions = await this.prisma.position.findMany({
      take: limit,
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
    });

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
