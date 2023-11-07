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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { DepartmentEntity } from './entities/department.entity';
import { Prisma } from '@prisma/client';
import { AppErrorMessage } from '../app.errors';
import { DepartmentsErrorMessage } from './departments.errors';
import { LoggerServiceImpl } from '../logger/logger.service';

@ApiTags('departments')
@Controller('departments')
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly loggerService: LoggerServiceImpl,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: DepartmentEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    const newDepartment =
      await this.departmentsService.create(createDepartmentDto);
    return new DepartmentEntity(newDepartment);
  }

  @Get()
  @ApiOkResponse({ type: [DepartmentEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findAll(@Query('limit') limit?: number) {
    const departments = await this.departmentsService.findAll(limit);
    return departments.map((department) => new DepartmentEntity(department));
  }

  @Get(':id')
  @ApiOkResponse({ type: DepartmentEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findOne(@Param('id') id: string) {
    const department = await this.departmentsService.findOne(id);

    if (department == null) {
      this.loggerService.error(DepartmentsErrorMessage.DEPARTMENT_NOT_FOUND);
      throw new NotFoundException(
        DepartmentsErrorMessage.DEPARTMENT_NOT_FOUND_CLIENT,
      );
    }

    return new DepartmentEntity(department);
  }

  @Patch(':id')
  @ApiOkResponse({ type: DepartmentEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    try {
      const updatedDepartment = await this.departmentsService.update(
        id,
        updateDepartmentDto,
      );
      return new DepartmentEntity(updatedDepartment);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          this.loggerService.error(
            DepartmentsErrorMessage.DEPARTMENT_NOT_FOUND,
          );
          throw new NotFoundException(
            DepartmentsErrorMessage.DEPARTMENT_NOT_FOUND_CLIENT,
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
      await this.departmentsService.remove(id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          this.loggerService.error(
            DepartmentsErrorMessage.DEPARTMENT_NOT_FOUND,
          );
          throw new NotFoundException(
            DepartmentsErrorMessage.DEPARTMENT_NOT_FOUND_CLIENT,
          );
        }
      }
      throw e;
    }
  }
}
