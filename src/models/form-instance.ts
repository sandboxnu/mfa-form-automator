import { prop, PropType, Ref } from "@typegoose/typegoose";
import Position from "./position";
import SignatureRequest from "./signature-request";
import Form from "./form";

class FormInstance {
    @prop({ required: true, ref: () => Form, type: () => Form })
    public formType!: Ref<Form>;

    @prop({ required: true, default: false, type: () => Boolean })
    public completed: boolean = false;

    @prop({ required: true, type: () => [SignatureRequest], default: [] }, PropType.ARRAY)
    public signingList: SignatureRequest[] = [];

    @prop({ required: true, ref: () => Position, type: () => Position })
    public initiator!: Ref<Position>;
};

export default FormInstance;
