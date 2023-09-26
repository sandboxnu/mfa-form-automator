import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
