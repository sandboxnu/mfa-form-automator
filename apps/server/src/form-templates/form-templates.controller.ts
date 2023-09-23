import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { FormTemplatesService } from './form-templates.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { FormTemplateEntity } from './entities/form-template.entity';
import { AppErrorMessage } from '@server/app.errors';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { FormTemplateErrorMessage } from './form-templates.errors';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { Prisma } from '@prisma/client';

@ApiTags('form-templates')
@Controller('form-templates')
export class FormTemplatesController {
  constructor(private readonly formTemplatesService: FormTemplatesService) {}

  @Post()
  @ApiCreatedResponse({ type: FormTemplateEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  async create(@Body() createFormTemplateDto: CreateFormTemplateDto) {
    const newFormTemplate = await this.formTemplatesService.create(createFormTemplateDto);
    return new FormTemplateEntity(newFormTemplate);
  }

  @Get()
  @ApiOkResponse({ type: [FormTemplateEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findAll(@Query('limit') limit?: number) {
    const formTemplates = await this.formTemplatesService.findAll(limit);
    return formTemplates.map((formTemplate) => new FormTemplateEntity(formTemplate));
  }

  @Get(':id')
  @ApiOkResponse({ type: FormTemplateEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findOne(@Param('id') id: string) {
    const formTemplate = await this.formTemplatesService.findOne(id);

    if (formTemplate == null) {
      console.log(FormTemplateErrorMessage.FORM_TEMPLATE_NOT_FOUND);
      throw new NotFoundException(FormTemplateErrorMessage.FORM_TEMPLATE_NOT_FOUND);
    }

    return new FormTemplateEntity(formTemplate);
  }

  @Patch(':id')
  @ApiOkResponse({ type: FormTemplateEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async update(@Param('id') id: string, @Body() UpdateFormTemplateDto: UpdateFormTemplateDto) {
    try {
      const updatedFormTemplate = await this.formTemplatesService.update(id, UpdateFormTemplateDto);
      return new FormTemplateEntity(updatedFormTemplate);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          console.log(FormTemplateErrorMessage.FORM_TEMPLATE_NOT_FOUND);
          throw new NotFoundException(FormTemplateErrorMessage.FORM_TEMPLATE_NOT_FOUND);
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
      await this.formTemplatesService.remove(id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          console.log(FormTemplateErrorMessage.FORM_TEMPLATE_NOT_FOUND);
          throw new NotFoundException(FormTemplateErrorMessage.FORM_TEMPLATE_NOT_FOUND);
        }
      }
      throw e;
    }
  }
}
