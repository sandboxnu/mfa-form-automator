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
import { Prisma } from '@prisma/client';
import { AppErrorMessage } from '../app.errors';
import { PositionsErrorMessage } from './positions.errors';
import { LoggerServiceImpl } from '../logger/logger.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PositionBaseEntity } from './entities/position.entity';
import { OptionalParseIntPipe } from '../pipes/OptionalParseInt.pipe';
import { SortOption } from '../utils';

@ApiTags('positions')
@Controller('positions')
export class PositionsController {
  constructor(
    private readonly positionsService: PositionsService,
    private readonly loggerService: LoggerServiceImpl,
  ) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  @ApiCreatedResponse({ type: PositionBaseEntity })
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
    return new PositionBaseEntity(newPosition);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [PositionBaseEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Limit on number of positions to return',
    required: false,
  })
  @ApiQuery({
    name: 'sortBy',
    enum: SortOption,
    description: 'Positions sorting option',
    required: false,
  })
  async findAll(
    @Query('limit', OptionalParseIntPipe) limit?: number,
    @Query('sortBy') sortBy?: SortOption,
  ) {
    const positions = await this.positionsService.findAll(limit, sortBy);
    return positions.map((position) => new PositionBaseEntity(position));
  }

  @Get('department/:departmentId')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [PositionBaseEntity] })
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
    @Query('limit', OptionalParseIntPipe) limit?: number,
  ) {
    const positions = await this.positionsService.findAllInDepartment(
      departmentId,
      limit,
    );
    return positions.map((position) => new PositionBaseEntity(position));
  }

  @Get('departmentName/:departmentName')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [PositionBaseEntity] })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiNotFoundResponse({ description: AppErrorMessage.NOT_FOUND })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async findAllInDepartmentName(
    @Param('departmentName') departmentName: string,
    @Query('limit') limit?: number,
  ) {
    const positions = await this.positionsService.findAllInDepartmentName(
      departmentName,
      limit,
    );
    return positions.map((position) => new PositionBaseEntity(position));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: PositionBaseEntity })
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
    return new PositionBaseEntity(position);
  }

  @Get('name/:name')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: PositionBaseEntity })
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
    return new PositionBaseEntity(position);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOkResponse({ type: PositionBaseEntity })
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
      return new PositionBaseEntity(updatedPosition);
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
