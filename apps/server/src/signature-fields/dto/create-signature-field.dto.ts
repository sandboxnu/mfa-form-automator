import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateSignatureFieldDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string; 
    
    @IsInt()
    @ApiProperty()
    order: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    signerPositionId?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    formTemplateId: string;
}
