import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ['email'] as const),
) {
  @IsOptional()
  @IsString()
  signatureLink?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
