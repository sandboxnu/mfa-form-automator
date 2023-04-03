import { Ref, prop } from "@typegoose/typegoose";
import SignatureChainLink from "./signature-chain-link";
import FormInstance from "./form-instance";
import Position from "./position";

class SignatureRequestLink {

    @prop({ required: true, ref: () => SignatureChainLink, type: () => SignatureChainLink })
    public signatureChainLink!: Ref<SignatureChainLink>;

    @prop({ required: true, ref: () => FormInstance, type: () => FormInstance })
    public formInstance!: Ref<FormInstance>;

    @prop({ required: true, ref: () => Position, type: () => Position })
    public position!: Ref<Position>;

    @prop({ required: true, type: () => Boolean })
    public canSign: boolean = false;

    @prop({ required: true, type: () => Boolean })
    public isSigned: boolean = false;

    // @prop({ required: true, ref: () => SignatureRequestLink, type: () => SignatureRequestLink })
    // public next?: Ref<SignatureRequestLink>;

    @prop({ required: true, type: () => String })
    public next?: string;
};

export default SignatureRequestLink;
