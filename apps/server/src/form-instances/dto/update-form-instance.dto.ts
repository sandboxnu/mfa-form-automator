import { PartialType } from '@nestjs/swagger';
import { CreateFormInstanceDto } from './create-form-instance.dto';

export class UpdateFormInstanceDto extends PartialType(CreateFormInstanceDto) {}
