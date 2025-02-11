import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateTemplateBoxDto } from './create-template-box.dto';

export class CreateFieldGroupDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  order: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @ApiProperty({
    isArray: true,
    type: CreateTemplateBoxDto,
  })
  templateBoxes: CreateTemplateBoxDto[];
}
