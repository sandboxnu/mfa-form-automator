import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ['email', 'password'] as const),
) {}
