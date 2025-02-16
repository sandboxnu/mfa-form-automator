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
  UseGuards,
} from '@nestjs/common';
import { FormTemplatesService } from './form-templates.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FormTemplateEntity } from './entities/form-template.entity';
import { AppErrorMessage } from '../app.errors';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { FormTemplateErrorMessage } from './form-templates.errors';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { Prisma } from '@prisma/client';
import { LoggerServiceImpl } from '../logger/logger.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@ApiTags('form-templates')
@Controller('form-templates')
export class FormTemplatesController {
  constructor(
    private readonly formTemplatesService: FormTemplatesService,
    private readonly loggerService: LoggerServiceImpl,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: FormTemplateEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  async create(@Body() createFormTemplateDto: CreateFormTemplateDto) {
    // TODO: Should only admins be able to create new templates?
    const newFormTemplate = await this.formTemplatesService.create(
      createFormTemplateDto,
    );
    return new FormTemplateEntity(newFormTemplate);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [FormTemplateEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Limit on number of form templates to return',
    required: false,
  })
  async findAll(@Query('limit') limit?: number) {
    const formTemplates = await this.formTemplatesService.findAll(limit);
    return formTemplates.map(
      (formTemplate) => new FormTemplateEntity(formTemplate),
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: FormTemplateEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findOne(@Param('id') id: string) {
    const formTemplate = await this.formTemplatesService.findOne(id);

    if (formTemplate == null) {
      this.loggerService.error(
        FormTemplateErrorMessage.FORM_TEMPLATE_NOT_FOUND,
      );
      throw new NotFoundException(
        FormTemplateErrorMessage.FORM_TEMPLATE_NOT_FOUND_CLIENT,
      );
    }

    return new FormTemplateEntity(formTemplate);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: FormTemplateEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async update(
    @Param('id') id: string,
    @Body() updateFormTemplateDto: UpdateFormTemplateDto,
  ) {
    // TODO: Should only admins be able to update templates?
    try {
      const updatedFormTemplate = await this.formTemplatesService.update(
        id,
        updateFormTemplateDto,
      );
      return new FormTemplateEntity(updatedFormTemplate);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          this.loggerService.error(
            FormTemplateErrorMessage.FORM_TEMPLATE_NOT_FOUND,
          );
          throw new NotFoundException(
            FormTemplateErrorMessage.FORM_TEMPLATE_NOT_FOUND_CLIENT,
          );
        }
      }
      throw e;
    }
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOkResponse()
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async remove(@Param('id') id: string) {
    // TODO: Should only admins be able to delete templates?
    try {
      await this.formTemplatesService.remove(id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          this.loggerService.error(
            FormTemplateErrorMessage.FORM_TEMPLATE_NOT_FOUND,
          );
          throw new NotFoundException(
            FormTemplateErrorMessage.FORM_TEMPLATE_NOT_FOUND_CLIENT,
          );
        }
      }
      throw e;
    }
  }
}
