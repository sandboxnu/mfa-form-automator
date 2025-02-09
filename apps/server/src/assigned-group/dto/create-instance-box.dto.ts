import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInstanceBoxDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  assignedGroupId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  templateBoxId: string;
}
