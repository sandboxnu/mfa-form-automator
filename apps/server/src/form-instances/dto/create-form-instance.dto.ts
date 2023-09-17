import { ApiProperty } from "@nestjs/swagger";
import { Signature } from "@prisma/client";
import { FormTemplate } from "@server/form-templates/entities/form-template.entity";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateFormInstanceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsArray()
    @ArrayMinSize(1)
    @ApiProperty()
    signatures: Signature[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    formTemplateId: string;

    @ApiProperty()
    @IsNotEmpty()
    formTemplate: FormTemplate;

}
