import { prop, PropType, Ref } from "@typegoose/typegoose";
import Position from "./position";
import Signee from "./signee";
import Form from "./form";

class FormInstance {
    @prop({ required: true, ref: () => Form, type: () => Form })
    public formType!: Ref<Form>;

    @prop({ required: true, default: false, type: () => Boolean })
    public completed: boolean = false;

    @prop({ required: true, type: () => [Signee], default: [] }, PropType.ARRAY)
    public signingList: Signee[] = [];

    @prop({ required: true, ref: () => Position, type: () => Position })
    public initiator!: Ref<Position>;
};

export default FormInstance;
