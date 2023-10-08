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
import { FormInstancesService } from './form-instances.service';
import { CreateFormInstanceDto } from './dto/create-form-instance.dto';
import { UpdateFormInstanceDto } from './dto/update-form-instance.dto';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiUnprocessableEntityResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { AppErrorMessage } from '@server/app.errors';
import { FormInstanceEntity } from './entities/form-instance.entity';
import { FormInstanceErrorMessage } from './form-instance.errors';

@ApiTags('form-instances')
@Controller('form-instances')
export class FormInstancesController {
  constructor(private readonly formInstancesService: FormInstancesService) {}

  @Post()
  @ApiCreatedResponse({ type: FormInstanceEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  async create(@Body() createFormInstanceDto: CreateFormInstanceDto) {
    const newFormTemplate = await this.formInstancesService.create(
      createFormInstanceDto,
    );
    return new FormInstanceEntity(newFormTemplate);
  }

  @Get()
  @ApiOkResponse({ type: [FormInstanceEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findAll(@Query('limit') limit?: number) {
    const formTemplates = await this.formInstancesService.findAll(limit);
    return formTemplates.map(
      (formInstance) => new FormInstanceEntity(formInstance),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: FormInstanceEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findOne(@Param('id') id: string) {
    const formInstance = await this.formInstancesService.findOne(id);

    if (formInstance == null) {
      console.log(FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND);
      throw new NotFoundException(
        FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND_CLIENT,
      );
    }

    return new FormInstanceEntity(formInstance);
  }

  @Patch(':id')
  @ApiOkResponse({ type: FormInstanceEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async update(
    @Param('id') id: string,
    @Body() updateFormInstanceDto: UpdateFormInstanceDto,
  ) {
    try {
      const updatedFormInstance = await this.formInstancesService.update(
        id,
        updateFormInstanceDto,
      );
      return new FormInstanceEntity(updatedFormInstance);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          console.log(FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND);
          throw new NotFoundException(
            FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND_CLIENT,
          );
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
      await this.formInstancesService.remove(id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          console.log(FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND);
          throw new NotFoundException(
            FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND_CLIENT,
          );
        }
      }
      throw e;
    }
  }
}
