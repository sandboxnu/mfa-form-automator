import {
  Controller, Post, Body, Query, Get, Param, NotFoundException, Patch, Delete,
} from '@nestjs/common';
import { SignatureFieldsService } from './signature-fields.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { SignatureFieldEntity } from './entities/signature-field.entity';
import { AppErrorMessage } from '@server/app.errors';
import { CreateSignatureFieldDto } from './dto/create-signature-field.dto';
import { SignatureFieldErrorMessage } from './signature-fields.errors';
import { UpdateSignatureFieldDto } from './dto/update-signature-field.dto';
import { Prisma } from '@prisma/client';

@Controller('signature-fields')
export class SignatureFieldsController {
  constructor(
    private readonly signatureFieldsService: SignatureFieldsService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: SignatureFieldEntity})
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async create(@Body() createSignatureFieldDto: CreateSignatureFieldDto) {
    const newSignatureField = await this.signatureFieldsService.create(
      createSignatureFieldDto,
    )

    return new SignatureFieldEntity(newSignatureField);
  }

  @Get()
  @ApiOkResponse({ type: [SignatureFieldEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findAll(@Query('limit') limit?: number) {
    const signatureFields = await this.signatureFieldsService.findAll(limit);
    return signatureFields.map(
      (signatureField) => new SignatureFieldEntity(signatureField),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: SignatureFieldEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findOne(@Param('id') id: string) {
    const signatureField = await this.signatureFieldsService.findOne(id);

    if (signatureField == null) {
      console.log(SignatureFieldErrorMessage.SIGNATURE_FIELD_NOT_FOUND);
      throw new NotFoundException(SignatureFieldErrorMessage.SIGNATURE_FIELD_NOT_FOUND_CLIENT);
    }

    return new SignatureFieldEntity(signatureField);
  }

  @Patch(':id')
  @ApiOkResponse({ type: SignatureFieldEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async update(@Param('id') id: string, @Body() updateSignatureFieldDto: UpdateSignatureFieldDto) {
    try {
      const updatedSignatureField = await this.signatureFieldsService.update(id, updateSignatureFieldDto);
      return new SignatureFieldEntity(updatedSignatureField);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          console.log(SignatureFieldErrorMessage.SIGNATURE_FIELD_NOT_FOUND);
          throw new NotFoundException(SignatureFieldErrorMessage.SIGNATURE_FIELD_NOT_FOUND_CLIENT);
        }
      }
      throw e;
    }
  }
  
  @Delete(':id')
  @ApiOkResponse()
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async remove(@Param('id') id: string) {
    try {
      await this.signatureFieldsService.remove(id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          console.log(SignatureFieldErrorMessage.SIGNATURE_FIELD_NOT_FOUND);
          throw new NotFoundException(SignatureFieldErrorMessage.SIGNATURE_FIELD_NOT_FOUND_CLIENT);
        }
      }
      throw e;
    }
  }
}
