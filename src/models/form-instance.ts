import { Prop, Ref } from "@typegoose/typegoose";
import Position from "./position";
import SignatureRequestLink from "./signature-request-link";
import Form from "./form";

class FormInstance {
    @Prop({ required: true, ref: () => Form, type: () => Form })
    public formType!: Ref<Form>;

    @Prop({ required: true, default: false, type: () => Boolean })
    public completed: boolean = false;

    @Prop({ required: true, ref: () => SignatureRequestLink, type: () => SignatureRequestLink })
    public signatureRequestHead!: Ref<SignatureRequestLink>;

    @Prop({ required: true, ref: () => Position, type: () => Position })
    public initiator!: Ref<Position>;
};

export default FormInstance;
