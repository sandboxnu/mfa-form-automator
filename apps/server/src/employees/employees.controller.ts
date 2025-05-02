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
  UnprocessableEntityException,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { EmployeeScope, Prisma } from '@prisma/client';
import { AppErrorMessage } from '../app.errors';
import { EmployeeErrorMessage } from './employees.errors';
import { AuthUser } from '../auth/auth.decorators';
import { UserEntity } from '../auth/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LoggerServiceImpl } from '../logger/logger.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { OnboardEmployeeDto } from './dto/onboard-employee.dto';
import {
  EmployeeBaseEntity,
  EmployeeSecureEntityHydrated,
} from './entities/employee.entity';
import {
  EmployeeBaseEntityResponse,
  EmployeesFindAllResponse,
} from './responses/employees-find-all.response';
import { SortOption } from '../utils';
import { UpdateSignatureDto } from './dto/update-signature.dto';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly loggerService: LoggerServiceImpl,
  ) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: EmployeeSecureEntityHydrated })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createEmployeeDto: CreateEmployeeDto,
  ) {
    try {
      const newEmployee = await this.employeesService.create(createEmployeeDto);
      return new EmployeeSecureEntityHydrated(newEmployee);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === EmployeeErrorMessage.EMPLOYEE_EMAIL_ALREADY_EXISTS) {
          this.loggerService.error(
            EmployeeErrorMessage.EMPLOYEE_EMAIL_ALREADY_EXISTS,
          );
          throw new UnprocessableEntityException(
            EmployeeErrorMessage.EMPLOYEE_EMAIL_ALREADY_EXISTS,
          );
        }
      }
    }
  }

  @Patch('/onboarding')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: EmployeeSecureEntityHydrated })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async onboardEmployee(
    @AuthUser() currentUser: UserEntity,
    @Body(new ValidationPipe({ transform: true }))
    onboardEmployeeDto: OnboardEmployeeDto,
  ) {
    const onboardedEmployee = await this.employeesService.update(
      currentUser.id,
      onboardEmployeeDto,
    );
    return new EmployeeSecureEntityHydrated(onboardedEmployee);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: EmployeesFindAllResponse })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Limit on number of employees to return',
    required: false,
  })
  @ApiQuery({
    name: 'secure',
    type: Boolean,
    description: 'If true, returns secure employee data',
    required: false,
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    description: 'Optional sorting parameter',
    required: false,
  })
  async findAll(
    @AuthUser() currentUser: UserEntity,
    @Query('limit') limit?: number,
    @Query('secure') secure?: string,
    @Query('sortBy') sortBy?: SortOption,
  ) {
    if (secure === 'true') {
      const currentEmployee = await this.employeesService.findOne(
        currentUser.id,
      );
      if (currentEmployee.scope !== EmployeeScope.ADMIN) {
        throw new NotFoundException(AppErrorMessage.FORBIDDEN);
      }
      const employees = await this.employeesService.findAllSecure({
        limit,
        sortBy,
      });
      return new EmployeesFindAllResponse(
        employees.length,
        employees.map((employee) => new EmployeeBaseEntityResponse(employee)),
      );
    }
    const employees = await this.employeesService.findAll({
      limit,
      sortBy,
    });
    return new EmployeesFindAllResponse(
      employees.length,
      employees.map((employee) => new EmployeeBaseEntityResponse(employee)),
    );
  }

  @Get('disabled')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: EmployeesFindAllResponse })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Limit on number of employees to return',
    required: false,
  })
  @ApiQuery({
    name: 'secure',
    type: Boolean,
    description: 'If true, returns secure employee data',
    required: false,
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    description: 'Optional sorting parameter',
    required: false,
  })
  async findAllDisabled(
    @AuthUser() currentUser: UserEntity,
    @Query('limit') limit?: number,
    @Query('secure') secure?: string,
    @Query('sortBy') sortBy?: SortOption,
  ) {
    if (secure === 'true') {
      const currentEmployee = await this.employeesService.findOne(
        currentUser.id,
      );
      if (currentEmployee.scope !== EmployeeScope.ADMIN) {
        throw new NotFoundException(AppErrorMessage.FORBIDDEN);
      }
      const employees = await this.employeesService.findAllSecure({
        limit,
        sortBy,
        isActive: false,
      });
      return new EmployeesFindAllResponse(
        employees.length,
        employees.map((employee) => new EmployeeBaseEntityResponse(employee)),
      );
    }
    const employees = await this.employeesService.findAll({
      limit,
      sortBy,
      isActive: false,
    });
    return new EmployeesFindAllResponse(
      employees.length,
      employees.map((employee) => new EmployeeBaseEntityResponse(employee)),
    );
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: EmployeeSecureEntityHydrated })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findMe(@AuthUser() currentUser: UserEntity) {
    const employee = await this.employeesService.findOne(currentUser.id);
    return new EmployeeSecureEntityHydrated(employee);
  }

  @Get(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOkResponse({ type: EmployeeBaseEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findOne(@Param('id') id: string) {
    const employee = await this.employeesService.findOne(id);
    if (employee == null) {
      this.loggerService.error(EmployeeErrorMessage.EMPLOYEE_NOT_FOUND);
      throw new NotFoundException(
        EmployeeErrorMessage.EMPLOYEE_NOT_FOUND_CLIENT,
      );
    }
    return new EmployeeBaseEntity(employee);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOkResponse({ type: EmployeeSecureEntityHydrated })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    updateEmployeeDto: UpdateEmployeeDto,
  ) {
    try {
      const updatedEmployee = await this.employeesService.update(
        id,
        updateEmployeeDto,
      );
      return new EmployeeSecureEntityHydrated(updatedEmployee);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          this.loggerService.error(EmployeeErrorMessage.EMPLOYEE_NOT_FOUND);
          throw new NotFoundException(
            EmployeeErrorMessage.EMPLOYEE_NOT_FOUND_CLIENT,
          );
        }
      }
      throw e;
    }
  }

  @Patch(':id/signature')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: EmployeeSecureEntityHydrated })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async updateSignature(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    updateSignatureDto: UpdateSignatureDto,
  ) {
    try {
      const updatedEmployee = await this.employeesService.update(
        id,
        updateSignatureDto,
      );
      return new EmployeeSecureEntityHydrated(updatedEmployee);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          this.loggerService.error(EmployeeErrorMessage.EMPLOYEE_NOT_FOUND);
          throw new NotFoundException(
            EmployeeErrorMessage.EMPLOYEE_NOT_FOUND_CLIENT,
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
    try {
      await this.employeesService.deactivate(id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2016' && e.message.includes('RecordNotFound')) {
          this.loggerService.error(EmployeeErrorMessage.EMPLOYEE_NOT_FOUND);
          throw new NotFoundException(
            EmployeeErrorMessage.EMPLOYEE_NOT_FOUND_CLIENT,
          );
        }
      }
      throw e;
    }
  }
}
