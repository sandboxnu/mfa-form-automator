import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ required: false, nullable: true })
  @Transform(({ value }) => {
    if (value === 'null') return null;
    return value;
  })
  departmentId: string | null;
}
