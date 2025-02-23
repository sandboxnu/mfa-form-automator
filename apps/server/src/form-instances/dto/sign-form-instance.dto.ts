import { ApiProperty } from '@nestjs/swagger';

export class SignFormInstanceDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
