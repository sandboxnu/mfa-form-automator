import { PropType, Ref, prop } from "@typegoose/typegoose";
import FormInstance from "./form-instance";
import GenericSignee from "./generic-signee";

class Form {    
    @prop({ required: true, unique: true, type: () => String })
    public name!: string;

    @prop({ required: true, type: () => GenericSignee, default: [] }, PropType.ARRAY)
    public signingOrder: GenericSignee[] = [];

    @prop({ required: true, ref: () => FormInstance, type: () => [FormInstance], default: [] }, PropType.ARRAY)
    public formInstances!: Ref<FormInstance>[];
};

export default Form;
