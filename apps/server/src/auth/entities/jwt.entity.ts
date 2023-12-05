import { ApiProperty } from '@nestjs/swagger';

export class JwtEntity {
  @ApiProperty()
  accessToken: string;
}
