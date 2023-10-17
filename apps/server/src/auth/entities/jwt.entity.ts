import { ApiProperty } from '@nestjs/swagger';

export class JwtEntity {
  @ApiProperty()
  access_token: string;
}
