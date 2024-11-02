import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSignatureFieldDto } from './dto/create-signature-field.dto';
import { UpdateSignatureFieldDto } from './dto/update-signature-field.dto';

@Injectable()
export class SignatureFieldsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new signature field.
   * @param createSignatureFieldDto create signature field dto
   * @returns the created signature field, hydrated
   */
  async create(createSignatureFieldDto: CreateSignatureFieldDto) {
    const newSignatureField = await this.prisma.signatureField.create({
      data: {
        name: createSignatureFieldDto.name,
        order: createSignatureFieldDto.order,
        formTemplateId: createSignatureFieldDto.formTemplateId,
      },
    });
    return newSignatureField;
  }

  /**
   * Retrieve all signature fields.
   * @param limit the number of signature fields we want to retrieve (optional)
   * @returns all signature fields, hydrated
   */
  async findAll(limit?: number) {
    const signatureFields = await this.prisma.signatureField.findMany({
      take: limit,
    });
    return signatureFields;
  }

  /**
   * Retrieve a signature field by id.
   * @param id the signature field id
   * @returns the selected signature field, hydrated
   */
  async findOne(id: string) {
    const signatureField = await this.prisma.signatureField.findFirstOrThrow({
      where: {
        id: id,
      },
    });
    return signatureField;
  }

  /**
   * Update a signature field.
   * @param id the signature field id
   * @param updateSignatureFieldDto update signature field dto
   * @returns the updated signature field, hydrated
   */
  async update(id: string, updateSignatureFieldDto: UpdateSignatureFieldDto) {
    const updatedSignatureField = this.prisma.signatureField.update({
      where: {
        id: id,
      },
      data: updateSignatureFieldDto,
    });
    return updatedSignatureField;
  }

  /**
   * Remove a signature field.
   * @param id the signature field id
   */
  async remove(id: string) {
    await this.prisma.signatureField.delete({
      where: {
        id: id,
      },
    });
  }
}
