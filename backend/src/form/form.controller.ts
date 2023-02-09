import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Form } from 'src/models/form.entity';
import { CreateFormDto, FormDto } from './form.dto';
import { FormService } from './form.service';

@Controller('forms')
@ApiTags('Forms')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new Form' })
  @ApiBody({ type: CreateFormDto })
  @ApiOkResponse({ description: 'The Created form', type: FormDto })
  async createForm(@Body() createFormDto: CreateFormDto): Promise<Form> {
    const createdForm = await this.formService.createForm(createFormDto);
    return createdForm;
  }
}
