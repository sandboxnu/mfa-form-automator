import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssignedGroup, SignerType } from '@prisma/client';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class AssignedGroupBaseEntity implements AssignedGroup {
  @ApiProperty()
  id: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  signed: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  signedDocLink: string | null;

  @IsDate()
  @ApiProperty()
  createdAt: Date;

  @IsDate()
  @ApiProperty()
  updatedAt: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  signerPositionId: string | null;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  signerDepartmentId: string | null;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  signerEmployeeId: string | null;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  signingEmployeeId: string | null;

  @ApiProperty({ enum: SignerType })
  signerType: SignerType;

  @IsString()
  @ApiProperty()
  formInstanceId: string;

  constructor(partial: Partial<AssignedGroupBaseEntity>) {
    Object.assign(this, partial);
  }
}
