import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFormInstanceDto } from './dto/create-form-instance.dto';
import { UpdateFormInstanceDto } from './dto/update-form-instance.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FormTemplatesService } from '../form-templates/form-templates.service';
import { FormInstanceErrorMessage } from './form-instance.errors';
import { SignatureErrorMessage } from '../signatures/signatures.errors';

@Injectable()
export class FormInstancesService {
  constructor(
    private prisma: PrismaService,
    private formTemplateService: FormTemplatesService,
  ) {}

  /**
   * Create a new form instance.
   * @param createFormInstanceDto
   */
  async create(createFormInstanceDto: CreateFormInstanceDto) {
    // TODO: Add validation before creating new form instance

    const formTemplate = await this.formTemplateService.findOne(
      createFormInstanceDto.formTemplateId,
    );
    const newFormInstance = await this.prisma.formInstance.create({
      data: {
        name: createFormInstanceDto.name,
        formDocLink: formTemplate.formDocLink,
        signatures: { create: createFormInstanceDto.signatures },
        originator: {
          connect: {
            id: createFormInstanceDto.originatorId,
          },
        },
        formTemplate: {
          connect: {
            id: createFormInstanceDto.formTemplateId,
          },
        },
      },
      include: {
        originator: true,
        formTemplate: true,
      },
    });
    return newFormInstance;
  }

  async findAll(limit?: number) {
    const formInstances = await this.prisma.formInstance.findMany({
      take: limit,
      include: {
        originator: true,
        formTemplate: true,
      },
    });
    return formInstances;
  }

  async findOne(id: string) {
    const formInstance = await this.prisma.formInstance.findFirst({
      where: {
        id: id,
      },
      include: {
        originator: true,
        formTemplate: true,
      },
    });
    return formInstance;
  }

  async update(id: string, updateFormInstanceDto: UpdateFormInstanceDto) {
    // TODO: How do we support updating signatures?

    const updatedFormInstance = this.prisma.formInstance.update({
      where: {
        id: id,
      },
      data: {
        name: updateFormInstanceDto.name,
        // signatures: { create: updateFormInstanceDto.signatures },
      },
      include: {
        originator: true,
        formTemplate: true,
      },
    });
    return updatedFormInstance;
  }

  async remove(id: string) {
    await this.prisma.formInstance.delete({
      where: {
        id: id,
      },
      include: {
        originator: true,
        formTemplate: true,
      },
    });
  }

  async signFormInstance(formInstanceId: string, signatureId: string) {
    const formInstance = await this.prisma.formInstance.findUnique({
      where: { id: formInstanceId },
      include: {
        signatures: { include: { signerPosition: true, userSignedBy: true } },
      },
    });

    if (!formInstance) {
      throw new NotFoundException(
        FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND,
      );
    }

    const signatureIndex = formInstance.signatures.findIndex(
      (sig) => sig.id === signatureId,
    );

    if (signatureIndex === -1) {
      throw new NotFoundException(SignatureErrorMessage.SIGNATURE_NOT_FOUND);
    }

    for (let i = 0; i < signatureIndex; i++) {
      if (!formInstance.signatures[i].signed) {
        throw new BadRequestException(SignatureErrorMessage.SIGNATURE_NOT_NEXT);
      }
    }

    const updatedSignature = await this.prisma.signature.update({
      where: { id: signatureId },
      data: { signed: true },
    });

    formInstance.signatures[signatureIndex] = {
      ...formInstance.signatures[signatureIndex],
      ...updatedSignature,
    };

    return formInstance;
  }
}
