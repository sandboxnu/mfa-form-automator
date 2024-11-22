import { ApiProperty } from '@nestjs/swagger';
import { CreateSignatureDto } from '../../signatures/dto/create-signature.dto';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateFormInstanceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({
    isArray: true,
    type: CreateSignatureDto,
  })
  signatures: CreateSignatureDto[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  originatorId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  formTemplateId: string;

  @IsString()
  @ApiProperty()
  documentId: string | null;
}
