import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class OnboardEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  signatureLink: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  positionId: string;
}
