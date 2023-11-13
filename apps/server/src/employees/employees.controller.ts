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
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { AuthUser } from '../auth/auth.decorators';
import { UserEntity } from '../auth/entities/user.entity';
import { JwtAuthGuard } from '@server/auth/guards/jwt-auth.guard';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @UseGuards(AdminAuthGuard)
  @Post()
  @ApiCreatedResponse({ type: EmployeeEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    // TODO: Auth
    const newEmployee = await this.employeesService.create(createEmployeeDto);
    return new EmployeeEntity(newEmployee);
  }

  @Get()
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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: EmployeeEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findMe(@AuthUser() currentUser: UserEntity) {
    const employee = await this.employeesService.findOne(currentUser.id);
    return new EmployeeEntity(employee);
  }

  @Get(':id')
  @ApiOkResponse({ type: EmployeeEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findOne(@Param('id') id: string) {
    // TODO: Auth
    const employee = await this.employeesService.findOne(id);
    if (employee == null) {
      console.log(EmployeeErrorMessage.EMPLOYEE_NOT_FOUND);
      throw new NotFoundException(
        EmployeeErrorMessage.EMPLOYEE_NOT_FOUND_CLIENT,
      );
    }
    return new EmployeeEntity(employee);
  }

  @Patch(':id')
  @ApiOkResponse({ type: EmployeeEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    // TODO: Auth
    try {
      const updatedEmployee = await this.employeesService.update(
        id,
        updateEmployeeDto,
      );
      return new EmployeeEntity(updatedEmployee);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          console.log(EmployeeErrorMessage.EMPLOYEE_NOT_FOUND);
          throw new NotFoundException(
            EmployeeErrorMessage.EMPLOYEE_NOT_FOUND_CLIENT,
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
    // TODO: Auth
    try {
      await this.employeesService.remove(id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2016' && e.message.includes('RecordNotFound')) {
          console.log(EmployeeErrorMessage.EMPLOYEE_NOT_FOUND);
          throw new NotFoundException(
            EmployeeErrorMessage.EMPLOYEE_NOT_FOUND_CLIENT,
          );
        }
      }
      throw e;
    }
  }
}
