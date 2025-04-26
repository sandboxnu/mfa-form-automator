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
  UseInterceptors,
  UploadedFile,
  PipeTransform,
  ValidationPipe,
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
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FormTemplateEntity } from './entities/form-template.entity';
import { AppErrorMessage } from '../app.errors';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { FormTemplateErrorMessage } from './form-templates.errors';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { Prisma } from '@prisma/client';
import { LoggerServiceImpl } from '../logger/logger.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContributorAuthGuard } from '../auth/guards/contributor-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FormTemplateFindAllResponse } from './responses/form-template-find-all.response';
import { SortOption } from '../utils';

export class ParseFormDataJsonPipe implements PipeTransform {
  constructor() {}

  transform(value: any) {
    const transformStringsToObjects = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          try {
            const parsedValue = JSON.parse(obj[key]);
            if (Array.isArray(parsedValue)) {
              obj[key] = parsedValue.map((item) => {
                if (typeof item === 'string') {
                  try {
                    return JSON.parse(item);
                  } catch (e) {
                    return item; // If parsing fails, keep the original string value
                  }
                }
                return item;
              });
            } else {
              if (key === 'fieldGroups') {
                obj[key] = [parsedValue];
              } else {
                obj[key] = parsedValue;
              }
            }
          } catch (e) {
            // If parsing fails, keep the original string value
          }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          transformStringsToObjects(obj[key]);
        }
      }
    };

    transformStringsToObjects(value);
    return value;
  }
}

@ApiTags('form-templates')
@Controller('form-templates')
export class FormTemplatesController {
  constructor(
    private readonly formTemplatesService: FormTemplatesService,
    private readonly loggerService: LoggerServiceImpl,
  ) {}

  @Post()
  @UseGuards(ContributorAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateFormTemplateDto,
  })
  @ApiCreatedResponse({ type: FormTemplateEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  async create(
    @Body(new ParseFormDataJsonPipe(), new ValidationPipe({ transform: true }))
    createFormTemplateDto: CreateFormTemplateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    createFormTemplateDto.file = file;
    const newFormTemplate = await this.formTemplatesService.create(
      createFormTemplateDto,
    );
    return new FormTemplateEntity(newFormTemplate);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: FormTemplateFindAllResponse })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  @ApiQuery({
    name: 'cursor',
    type: Number,
    description: 'Pagination cursor for form templates to return (pages of 8)',
    required: false,
  })
  @ApiQuery({
    name: 'sortBy',
    enum: SortOption,
    description: 'Sort option for form templates',
    required: false,
  })
  async findAll(
    @Query('cursor') cursor?: number,
    @Query('sortBy') sortBy?: SortOption,
  ) {
    const formTemplates = await this.formTemplatesService.findAll({
      cursor,
      sortBy,
    });
    const formTemplatesCount = await this.formTemplatesService.findAllCount();
    return new FormTemplateFindAllResponse(
      formTemplatesCount,
      formTemplates?.map(
        (formTemplate) => new FormTemplateEntity(formTemplate),
      ),
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
  @UseGuards(AdminAuthGuard)
  @ApiOkResponse({ type: FormTemplateEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    updateFormTemplateDto: UpdateFormTemplateDto,
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
