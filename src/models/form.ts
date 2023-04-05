import { PropType, Ref, prop } from "@typegoose/typegoose";
import FormInstance from "./form-instance";
import GenericSignatureRequest from "./generic-signature-request";

class Form {    
    @prop({ required: true, unique: true, type: () => String })
    public name!: string;

    @prop({ required: true, type: () => GenericSignatureRequest, default: [] }, PropType.ARRAY)
    public signingOrder: GenericSignatureRequest[] = [];

    @prop({ required: true, ref: () => FormInstance, type: () => [FormInstance], default: [] }, PropType.ARRAY)
    public formInstances!: Ref<FormInstance>[];
};

export default Form;
