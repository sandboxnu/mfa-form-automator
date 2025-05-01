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
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
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
  ApiConsumes,
} from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import { AppErrorMessage } from '../app.errors';
import { FormInstanceEntity } from './entities/form-instance.entity';
import { FormInstanceErrorMessage } from './form-instance.errors';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../auth/auth.decorators';
import { UserEntity } from '../auth/entities/user.entity';
import { LoggerServiceImpl } from '../logger/logger.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { SignFormInstanceDto } from './dto/sign-form-instance.dto';
import { ParseFormDataJsonPipe } from '../form-templates/form-templates.controller';
import { EmployeesService } from '../employees/employees.service';
import { FormInstanceFindAllResponse } from './response/form-instance-find-all.response';
import { SortOption } from '../utils';

@ApiTags('form-instances')
@Controller('form-instances')
export class FormInstancesController {
  constructor(
    private readonly formInstancesService: FormInstancesService,
    private readonly employeesService: EmployeesService,
    private readonly loggerService: LoggerServiceImpl,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: FormInstanceEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createFormInstanceDto: CreateFormInstanceDto,
  ) {
    const newFormInstance = await this.formInstancesService.create(
      createFormInstanceDto,
    );
    return new FormInstanceEntity(newFormInstance);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  @ApiOkResponse({ type: FormInstanceFindAllResponse })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  @ApiQuery({
    name: 'cursor',
    type: Number,
    description: 'Pagination cursor for form instances to return (pages of 8)',
    required: false,
  })
  @ApiQuery({
    name: 'sortBy',
    enum: SortOption,
    description: 'Form instance sorting option',
    required: false,
  })
  async findAll(
    @Query('cursor') cursor?: number,
    @Query('sortBy') sortBy?: SortOption,
  ) {
    const formInstances = await this.formInstancesService.findAll({
      cursor,
      sortBy,
    });
    const totalCount = await this.formInstancesService.findAllCount();
    return new FormInstanceFindAllResponse(
      totalCount,
      formInstances.map((formInstance) => new FormInstanceEntity(formInstance)),
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [FormInstanceEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  @ApiQuery({
    name: 'sortBy',
    enum: SortOption,
    description: 'Form instance sorting option',
    required: false,
  })
  async findAllAssignedToCurrentEmployee(
    @AuthUser() currentUser: UserEntity,
    @Query('sortBy') sortBy?: SortOption,
  ) {
    const formInstances = await this.formInstancesService.findAssignedTo({
      employeeId: currentUser.id,
      sortBy,
    });
    return formInstances.map(
      (formInstance) => new FormInstanceEntity(formInstance),
    );
  }

  @Get('created/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [FormInstanceEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  @ApiQuery({
    name: 'sortBy',
    enum: SortOption,
    description: 'Form instance sorting option',
    required: false,
  })
  async findAllCreatedByCurrentEmployee(
    @AuthUser() currentUser: UserEntity,
    @Query('sortBy') sortBy?: SortOption,
  ) {
    const formInstances = await this.formInstancesService.findCreatedBy({
      employeeId: currentUser.id,
      sortBy,
    });
    return formInstances.map(
      (formInstance) => new FormInstanceEntity(formInstance),
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: FormInstanceEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findOne(@Param('id') id: string, @AuthUser() currentUser: UserEntity) {
    const formInstance = await this.formInstancesService.findOne(id);
    const employee = await this.employeesService.findOne(currentUser.id);

    if (formInstance == null) {
      this.loggerService.error(
        FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND,
      );
      throw new NotFoundException(
        FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND_CLIENT,
      );
    }

    // check originator and signers, and if user is an admin
    if (
      employee.scope !== $Enums.EmployeeScope.ADMIN &&
      formInstance.originatorId !== currentUser.id &&
      !formInstance.assignedGroups.some((group) => {
        return (
          group.signerEmployee?.id === currentUser.id ||
          group.signerDepartment?.id === employee.position?.department?.id ||
          group.signerPosition?.id === employee.position?.id
        );
      })
    ) {
      this.loggerService.error(
        FormInstanceErrorMessage.FORM_INSTANCE_NOT_AUTHORIZED,
      );
      throw new UnauthorizedException(
        FormInstanceErrorMessage.FORM_INSTANCE_NOT_AUTHORIZED,
      );
    }

    return new FormInstanceEntity(formInstance);
  }

  async checkAuthorization(
    formInstanceId: string,
    currentUser: UserEntity,
  ): Promise<void> {
    const formInstance = await this.formInstancesService.findOne(
      formInstanceId,
    );
    if (formInstance == null) {
      this.loggerService.error(
        FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND,
      );
      throw new NotFoundException(
        FormInstanceErrorMessage.FORM_INSTANCE_NOT_FOUND_CLIENT,
      );
    }
    if (formInstance.originatorId !== currentUser.id) {
      this.loggerService.error(
        FormInstanceErrorMessage.FORM_INSTANCE_NOT_AUTHORIZED,
      );
      throw new UnauthorizedException(
        FormInstanceErrorMessage.FORM_INSTANCE_NOT_AUTHORIZED,
      );
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: FormInstanceEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async update(
    @AuthUser() currentUser: UserEntity,
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    updateFormInstanceDto: UpdateFormInstanceDto,
  ) {
    await this.checkAuthorization(id, currentUser);
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
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async remove(@AuthUser() currentUser: UserEntity, @Param('id') id: string) {
    await this.checkAuthorization(id, currentUser);
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

  @Patch(':formInstanceId/sign/:signatureId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: FormInstanceEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  async signFormInstance(
    @AuthUser() currentUser: UserEntity,
    @Param('formInstanceId') formInstanceId: string,
    @Body(new ParseFormDataJsonPipe(), new ValidationPipe({ transform: true }))
    signFormInstanceDto: SignFormInstanceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    signFormInstanceDto.file = file;
    try {
      const updatedFormInstance =
        await this.formInstancesService.signFormInstance(
          formInstanceId,
          signFormInstanceDto.assignedGroupId,
          currentUser,
          signFormInstanceDto,
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

  @Patch(':formInstanceId/complete')
  @UseGuards(JwtAuthGuard)
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
    await this.checkAuthorization(formInstanceId, currentUser);
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
