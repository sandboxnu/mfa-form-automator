import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Form } from '../models/form.entity';
import { Position } from '../models/position.entity';
import { CreateFormInstanceDto, FormInstanceDto } from './formInstance.dto';
import { FormService } from '../form/form.service';
import { FormInstanceService } from './formInstance.service';
import { PositionService } from '../position/position.service';

@Controller('formInstances')
@ApiTags('Form Instances')
export class FormInstanceController {
  constructor(
    private readonly formInstanceService: FormInstanceService,
    private readonly positionService: PositionService,
    private readonly formService: FormService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new FormInstance' })
  @ApiBody({ type: CreateFormInstanceDto })
  @ApiOkResponse({
    description: 'The created form instance',
    type: FormInstanceDto,
  })
  async createFormInstance(
    @Body() createFormInstanceDto: CreateFormInstanceDto,
  ): Promise<Number> {
    let position: Position = await this.positionService.getPositionById(
      createFormInstanceDto.positionId,
    );
    if (!position) {
      throw new HttpException('Employee not found', HttpStatus.BAD_REQUEST);
    }
    let forms: Form[] = await this.formService.getFormById(
      createFormInstanceDto.formId,
    );
    if (forms.length === 0) {
      throw new HttpException('Form not found', HttpStatus.BAD_REQUEST);
    }
    const createdFormInstance =
      await this.formInstanceService.createFormInstance(createFormInstanceDto);
    return createdFormInstance.id;
  }
}
