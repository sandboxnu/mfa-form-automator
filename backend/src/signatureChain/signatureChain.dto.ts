import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
import { SigningPositions } from "src/ts/enums/SigningPositions"

export class CreateSignatureChainLinkDto {
    @ApiProperty()
    position: SigningPositions

    @ApiProperty()
    specificPositionId: number
}

export class CreateSignatureChainDto {
    @IsNotEmpty()
    @ApiProperty()
    formId: number

    @IsNotEmpty()
    @ApiProperty()
    signatureChainLinks: CreateSignatureChainLinkDto[]
}

export class SignatureChainLinkDto {
    @IsNotEmpty()
    @ApiProperty()
    formId: number

    @ApiProperty()
    position: SigningPositions

    @ApiProperty()
    specificPositionId: number

    @IsNotEmpty()
    @ApiProperty()
    nextSignatureId: number
}
