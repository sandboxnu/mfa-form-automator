import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateTemplateBoxDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty({
    enum: ['signature', 'checkbox'],
  })
  type: any;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  x_coordinate: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  y_coordinate: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fieldGroupId: string;
}
