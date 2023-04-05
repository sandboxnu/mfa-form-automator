import { getModelForClass } from "@typegoose/typegoose";
import Employee from "./employee";
import Department from "./department";
import Position from "./position";
import FormInstance from "./form-instance";
import Form from "./form";

export const DepartmentModel = getModelForClass(Department);
export const EmployeeModel = getModelForClass(Employee);
export const FormInstanceModel = getModelForClass(FormInstance);
export const FormModel = getModelForClass(Form);
export const PositionModel = getModelForClass(Position);
