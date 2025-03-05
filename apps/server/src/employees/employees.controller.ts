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
import { EmployeeEntity } from './entities/employee.entity';
import { Prisma } from '@prisma/client';
import { AppErrorMessage } from '../app.errors';
import { EmployeeErrorMessage } from './employees.errors';
import { AuthUser } from '../auth/auth.decorators';
import { UserEntity } from '../auth/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LoggerServiceImpl } from '../logger/logger.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { OnboardEmployeeDto } from './dto/onboard-employee.dto';

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
  @ApiCreatedResponse({ type: EmployeeEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createEmployeeDto: CreateEmployeeDto,
  ) {
    // TODO: Auth
    const newEmployee = await this.employeesService.create(createEmployeeDto);
    return new EmployeeEntity(newEmployee);
  }

  @Patch('/onboarding')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: EmployeeEntity })
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
    return new EmployeeEntity(onboardedEmployee);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [EmployeeEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Limit on number of positions to return',
    required: false,
  })
  async findAll(@Query('limit') limit?: number) {
    // TODO: Auth
    const employees = await this.employeesService.findAll(limit);
    return employees.map((employee) => new EmployeeEntity(employee));
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: EmployeeEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findMe(@AuthUser() currentUser: UserEntity) {
    const employee = await this.employeesService.findOne(currentUser.id);
    return new EmployeeEntity(employee);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: EmployeeEntity })
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
    return new EmployeeEntity(employee);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOkResponse({ type: EmployeeEntity })
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
      return new EmployeeEntity(updatedEmployee);
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
      await this.employeesService.remove(id);
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
