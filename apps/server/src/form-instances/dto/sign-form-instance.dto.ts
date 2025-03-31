import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignFormInstanceDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  assignedGroupId: string;
}
