import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormService } from '../form/form.service';
import { Form } from '../models/form.entity';
import { Position } from '../models/position.entity';
import { PositionService } from '../position/position.service';
import { CreateFormInstanceDto, FormInstanceDto } from './formInstance.dto';
import { FormInstanceService } from './formInstance.service';

@Controller('formInstances')
@ApiTags('Form Instances')
export class FormInstanceController {
    constructor(
        private readonly formInstanceService: FormInstanceService,
        private readonly positionService: PositionService,
        private readonly formService: FormService
    ) {}
    
    @Post()
    @ApiOperation({ summary: 'Creates a new FormInstance' })
    @ApiBody({ type: CreateFormInstanceDto })
    @ApiOkResponse({ description: 'The created form instance', type: FormInstanceDto })
    async createFormInstance(@Body() createFormInstanceDto: CreateFormInstanceDto): Promise<Number> {
        let positions: Position[] = await this.positionService.getPositionById(createFormInstanceDto.positionId);
        if (positions.length === 0) {
            throw new HttpException('Employee not found', HttpStatus.BAD_REQUEST);
        }
        let forms: Form[] = await this.formService.getFormById(createFormInstanceDto.formId);
        if (forms.length === 0) {
            throw new HttpException('Form not found', HttpStatus.BAD_REQUEST);
        }
        const createdFormInstance = await this.formInstanceService.createFormInstance(createFormInstanceDto);
        return createdFormInstance.id;
    }
}

