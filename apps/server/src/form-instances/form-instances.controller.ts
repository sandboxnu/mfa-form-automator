import {
  Controller,
  // Get,
  // Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { FormInstancesService } from './form-instances.service';
// import { CreateFormInstanceDto } from './dto/create-form-instance.dto';
// import { UpdateFormInstanceDto } from './dto/update-form-instance.dto';

@Controller('form-instances')
export class FormInstancesController {
  constructor(private readonly formInstancesService: FormInstancesService) {}

  // @Post()
  // create(@Body() createFormInstanceDto: CreateFormInstanceDto) {
  //   return this.formInstancesService.create(createFormInstanceDto);
  // }

  // @Get()
  // findAll() {
  //   return this.formInstancesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.formInstancesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateFormInstanceDto: UpdateFormInstanceDto,
  // ) {
  //   return this.formInstancesService.update(+id, updateFormInstanceDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.formInstancesService.remove(+id);
  // }
}
