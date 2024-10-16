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
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { PositionEntity } from './entities/position.entity';
import { Prisma } from '@prisma/client';
import { AppErrorMessage } from '../app.errors';
import { PositionsErrorMessage } from './positions.errors';
import { LoggerServiceImpl } from '../logger/logger.service';
import { CreateDepartmentDto } from '@server/departments/dto/create-department.dto';

@ApiTags('positions')
@Controller('positions')
export class PositionsController {
  constructor(
    private readonly positionsService: PositionsService,
    private readonly loggerService: LoggerServiceImpl,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: PositionEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async create(@Body() createPositionDto: CreatePositionDto) {
    const newPosition = await this.positionsService.create(createPositionDto);
    return new PositionEntity(newPosition);
  }

  @Post('department')
  @ApiCreatedResponse({ type: PositionEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async createWithDepartment(
    @Body() positionName: string,
    @Body() createDepartmentDto: CreateDepartmentDto,
  ) {
    const newPosition = await this.positionsService.createWithDepartment(
      positionName,
      createDepartmentDto,
    );
    return new PositionEntity(newPosition);
  }

  @Get()
  @ApiOkResponse({ type: [PositionEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Limit on number of positions to return',
    required: false,
  })
  async findAll(@Query('limit') limit?: number) {
    const positions = await this.positionsService.findAll(limit);
    return positions.map((position) => new PositionEntity(position));
  }

  @Get(':id')
  @ApiOkResponse({ type: PositionEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findOne(@Param('id') id: string) {
    const position = await this.positionsService.findOne(id);
    if (position == null) {
      this.loggerService.error(PositionsErrorMessage.POSITION_NOT_FOUND);
      throw new NotFoundException(
        PositionsErrorMessage.POSITION_NOT_FOUND_CLIENT,
      );
    }
    return new PositionEntity(position);
  }

  @Get('name/:name')
  @ApiOkResponse({ type: PositionEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findOneByNameInDepartment(
    @Param('name') name: string,
    @Query('departmentId') departmentId: string,
  ) {
    const position = await this.positionsService.findOneByNameInDepartment(
      name,
      departmentId,
    );
    if (position == null) {
      this.loggerService.error(PositionsErrorMessage.POSITION_NOT_FOUND);
      throw new NotFoundException(
        PositionsErrorMessage.POSITION_NOT_FOUND_CLIENT,
      );
    }
    return new PositionEntity(position);
  }

  @Patch(':id')
  @ApiOkResponse({ type: PositionEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    try {
      const updatedPosition = await this.positionsService.update(
        id,
        updatePositionDto,
      );
      return new PositionEntity(updatedPosition);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          this.loggerService.error(PositionsErrorMessage.POSITION_NOT_FOUND);
          throw new NotFoundException(
            PositionsErrorMessage.POSITION_NOT_FOUND_CLIENT,
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
      await this.positionsService.remove(id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          this.loggerService.error(PositionsErrorMessage.POSITION_NOT_FOUND);
          throw new NotFoundException(
            PositionsErrorMessage.POSITION_NOT_FOUND_CLIENT,
          );
        }
      }
      throw e;
    }
  }
}
