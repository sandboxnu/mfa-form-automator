import { PropType, Ref, prop } from "@typegoose/typegoose";
import FormInstance from "./form-instance";
import { SigningPositions } from "../enums/signing-positions";

class Form {    
    @prop({ required: true, unique: true, type: () => String })
    public name!: string;

    @prop({ required: true, type: () => String, enum: SigningPositions, default: [] }, PropType.ARRAY)
    public signingOrder: SigningPositions[] = [];

    @prop({ required: true, ref: () => FormInstance, type: () => [FormInstance], default: [] }, PropType.ARRAY)
    public formInstances!: Ref<FormInstance>[];
};

export default Form;
