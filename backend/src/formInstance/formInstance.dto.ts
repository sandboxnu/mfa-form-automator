import { IsNotEmpty } from "class-validator";
import { Form } from "src/models/form.entity";
import { Position } from "src/models/position.entity";
import { SignatureRequestLink } from "src/models/signatureRequestLink.entity";

export class CreateFormInstanceDto {
    @IsNotEmpty()
    employeeId: number;

    @IsNotEmpty()
    formId: number;
}

export class FormInstanceDto {
    formType: Form;
    completed: boolean;
    signatureRequestHead: SignatureRequestLink;
    initiatorId: number;
}