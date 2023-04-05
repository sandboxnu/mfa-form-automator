import { PropType, Ref, prop } from "@typegoose/typegoose";
import Department from "./department";
import Employee from "./employee";
import FormInstance from "./form-instance";
import { SigningPositions } from "../enums/signing-positions";

class Position {
    @prop({ required: true, type: () => String })
    public roleName!: string;

    @prop({ required: true, type: () => String, enum: SigningPositions })
    public signingPosition!: SigningPositions;

    @prop({ required: true, type: () => String })
    public manager?: string;

    @prop({ required: true, type: () => [String], default: [] }, PropType.ARRAY)
    public underlings: string[] = [];

    @prop({ required: true, ref: () => Department, type: () => Department })
    public department!: Ref<Department>;

    @prop({ required: true, ref: () => Employee, type: () => Employee })
    public employee!: Ref<Employee>;

    @prop({ required: true, ref: () => FormInstance, type: () => [FormInstance], default: [] }, PropType.ARRAY)
    public formInstances: Ref<FormInstance>[] = [];
};

export default Position;
