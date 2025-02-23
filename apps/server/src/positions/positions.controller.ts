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
  ParseIntPipe,
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
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('positions')
@Controller('positions')
export class PositionsController {
  constructor(
    private readonly positionsService: PositionsService,
    private readonly loggerService: LoggerServiceImpl,
  ) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  @ApiCreatedResponse({ type: PositionEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createPositionDto: CreatePositionDto,
  ) {
    // TODO: Should only admins be able to create new positions?
    const newPosition = await this.positionsService.create(createPositionDto);
    return new PositionEntity(newPosition);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [PositionEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Limit on number of positions to return',
    required: false,
  })
  async findAll(@Query('limit', ParseIntPipe) limit?: number) {
    const positions = await this.positionsService.findAll(limit);
    return positions.map((position) => new PositionEntity(position));
  }

  @Get('department/:departmentId')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [PositionEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Limit on number of positions to return',
    required: false,
  })
  async findAllInDepartment(
    @Param('departmentId') departmentId: string,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    const positions = await this.positionsService.findAllInDepartment(
      departmentId,
      limit,
    );
    return positions.map((position) => new PositionEntity(position));
  }

  @Get('departmentName/:departmentName')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [PositionEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findAllInDepartmentName(
    @Param('departmentName') departmentName: string,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    const positions = await this.positionsService.findAllInDepartmentName(
      departmentName,
      limit,
    );
    return positions.map((position) => new PositionEntity(position));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(AdminAuthGuard)
  @ApiOkResponse({ type: PositionEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    updatePositionDto: UpdatePositionDto,
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
  @UseGuards(AdminAuthGuard)
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
