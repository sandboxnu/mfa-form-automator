import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Form } from 'src/models/form.entity';
import { CreateFormDto, FormDto } from './form.dto';
import { FormService } from './form.service';

@Controller('forms')
@ApiTags('Forms')
export class FormController {
  constructor(private readonly formService: FormService) {}

  //? Should form include pdf link?
  //? Non duplicates for name and link?
  @Post()
  @ApiOperation({ summary: 'Creates a new Form' })
  @ApiBody({ type: CreateFormDto })
  @ApiOkResponse({ description: 'The Created form', type: FormDto })
  async createForm(@Body() createFormDto: CreateFormDto): Promise<Form> {
    const createdForm = await this.formService.createForm(createFormDto);
    return createdForm;
  }

  @Get()
  async findAllForms() {
    await this.formService.findAllForms();
  }
}
