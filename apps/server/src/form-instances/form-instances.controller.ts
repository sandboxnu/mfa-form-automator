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
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { AppErrorMessage } from '../app.errors';
import { FormInstanceEntity } from './entities/form-instance.entity';
import { FormInstanceErrorMessage } from './form-instance.errors';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../auth/auth.decorators';
import { UserEntity } from '../auth/entities/user.entity';
import { LoggerServiceImpl } from '../logger/logger.service';

@ApiTags('form-instances')
@Controller('form-instances')
export class FormInstancesController {
  constructor(
    private readonly formInstancesService: FormInstancesService,
    private readonly loggerService: LoggerServiceImpl,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: FormInstanceEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  async create(@Body() createFormInstanceDto: CreateFormInstanceDto) {
    const newFormInstance = await this.formInstancesService.create(
      createFormInstanceDto,
    );
    return new FormInstanceEntity(newFormInstance);
  }

  @Get()
  @ApiOkResponse({ type: [FormInstanceEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Limit on number of positions to return',
    required: false,
  })
  async findAll(@Query('limit') limit?: number) {
    const formInstances = await this.formInstancesService.findAll(limit);

    return formInstances.map(
      (formInstance) => new FormInstanceEntity(formInstance),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: [FormInstanceEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findAllAssignedToCurrentEmployee(@AuthUser() currentUser: UserEntity) {
    const formInstances = await this.formInstancesService.findAssignedTo(
      currentUser.id,
    );

    return formInstances.map(
      (formInstance) => new FormInstanceEntity(formInstance),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('created/me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: [FormInstanceEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findAllCreatedByCurrentEmployee(@AuthUser() currentUser: UserEntity) {
    const formInstances = await this.formInstancesService.findCreatedBy(
      currentUser.id,
    );
    return formInstances.map(
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
      this.loggerService.error(
        FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND,
      );
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
          this.loggerService.error(
            FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND,
          );
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
          this.loggerService.error(
            FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND,
          );
          throw new NotFoundException(
            FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND_CLIENT,
          );
        }
      }
      throw e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':formInstanceId/sign/:signatureId')
  @ApiOkResponse({ type: FormInstanceEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  async signFormInstance(
    @AuthUser() currentUser: UserEntity,
    @Param('formInstanceId') formInstanceId: string,
    @Param('assignedGroupId') assignedGroupId: string,
  ) {
    try {
      const updatedFormInstance =
        await this.formInstancesService.signFormInstance(
          formInstanceId,
          assignedGroupId,
          currentUser,
        );
      return new FormInstanceEntity(updatedFormInstance);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          this.loggerService.error(
            FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND,
          );
          throw new NotFoundException(
            FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND_CLIENT,
          );
        }
      }
      throw e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':formInstanceId/complete')
  @ApiBearerAuth()
  @ApiOkResponse({ type: FormInstanceEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  async completeFormInstance(
    @AuthUser() currentUser: UserEntity,
    @Param('formInstanceId') formInstanceId: string,
  ) {
    try {
      const updatedFormInstance =
        await this.formInstancesService.markFormInstanceAsCompleted(
          currentUser.id,
          formInstanceId,
        );
      return updatedFormInstance;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          this.loggerService.error(
            FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND,
          );
          throw new NotFoundException(
            FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND_CLIENT,
          );
        }
      }
      throw e;
    }
  }
}
