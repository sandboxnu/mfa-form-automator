import { IsOptional, IsString } from 'class-validator';

export class UpdateSignatureDto {
  @IsOptional()
  @IsString()
  signatureLink?: string;
}
