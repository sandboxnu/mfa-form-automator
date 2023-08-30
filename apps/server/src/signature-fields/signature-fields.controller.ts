import {
  Controller,
  // Get,
  // Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { SignatureFieldsService } from './signature-fields.service';
// import { CreateSignatureFieldDto } from './dto/create-signature-field.dto';
// import { UpdateSignatureFieldDto } from './dto/update-signature-field.dto';

@Controller('signature-fields')
export class SignatureFieldsController {
  constructor(
    private readonly signatureFieldsService: SignatureFieldsService,
  ) {}

  // @Post()
  // create(@Body() createSignatureFieldDto: CreateSignatureFieldDto) {
  //   return this.signatureFieldsService.create(createSignatureFieldDto);
  // }

  // @Get()
  // findAll() {
  //   return this.signatureFieldsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.signatureFieldsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateSignatureFieldDto: UpdateSignatureFieldDto,
  // ) {
  //   return this.signatureFieldsService.update(+id, updateSignatureFieldDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.signatureFieldsService.remove(+id);
  // }
}
