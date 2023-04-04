import { prop, PropType, Ref } from "@typegoose/typegoose";
import Position from "./position";
import SignatureRequestLink from "./signature-request-link";
import Form from "./form";

class FormInstance {
    @prop({ required: true, ref: () => Form, type: () => Form })
    public formType!: Ref<Form>;

    @prop({ required: true, default: false, type: () => Boolean })
    public completed: boolean = false;

    @prop({ required: true, type: () => [SignatureRequestLink], default: [] }, PropType.ARRAY)
    public signingList: SignatureRequestLink[] = [];

    @prop({ required: true, ref: () => Position, type: () => Position })
    public initiator!: Ref<Position>;
};

export default FormInstance;
