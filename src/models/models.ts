import { getModelForClass } from "@typegoose/typegoose";
import Employee from "./employee";
import Department from "./department";
import Position from "./position";
import FormInstance from "./form-instance";
import Form from "./form";
import SignatureChainLink from "./signature-chain-link";
import SignatureRequestLink from "./signature-request-link";

export const DepartmentModel = getModelForClass(Department);
export const EmployeeModel = getModelForClass(Employee);
export const FormInstanceModel = getModelForClass(FormInstance);
export const FormModel = getModelForClass(Form);
export const PositionModel = getModelForClass(Position);
export const SignatureChainLinkModel = getModelForClass(SignatureChainLink);
export const SignatureRequestLinkModel = getModelForClass(SignatureRequestLink);
