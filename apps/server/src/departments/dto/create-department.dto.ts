import { ApiProperty } from '@nestjs/swagger';
import { Position } from '@prisma/client';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsArray()
  @ApiProperty()
  signatureFields: Position[];
}
