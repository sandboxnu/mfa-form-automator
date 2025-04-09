import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsOptional,
  IsInt,
} from 'class-validator';
import { CreateFieldGroupDto } from '../../field-group/dto/create-field-group.dto';
import { Type } from 'class-transformer';

export class CreateFormTemplateDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsInt()
  @ApiProperty()
  pageWidth: number;

  @IsInt()
  @ApiProperty()
  pageHeight: number;

  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CreateFieldGroupDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    isArray: true,
    type: CreateFieldGroupDto,
  })
  fieldGroups: CreateFieldGroupDto[];
}
