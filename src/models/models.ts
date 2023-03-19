import { getModelForClass } from "@typegoose/typegoose";
import { Employee } from "./Employee";

export const EmployeeModel = getModelForClass(Employee);
