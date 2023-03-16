import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { SignatureRequestLink } from "../models/signatureRequestLink.entity";

export class CreateFormInstanceDto {
    @IsNotEmpty()
    @ApiProperty()
    positionId: number;

    @IsNotEmpty()
    @ApiProperty()
    formId: number;
}

export class FormInstanceDto {
    @ApiProperty()
    formId: number;

    @ApiProperty()
    completed: boolean;

    @ApiProperty()
    signatureRequestHead: SignatureRequestLink;

    @ApiProperty()
    initiatorId: number;
}
