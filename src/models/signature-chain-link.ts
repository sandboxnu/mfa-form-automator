import { Ref, prop } from "@typegoose/typegoose";
import Form from "./form";
import { SigningPositions } from "@/enums/signing-positions";
import Position from "./position";

class SignatureChainLink {

    @prop({ required: true, ref: () => Form, type: () => Form })
    public form!: Form;

    @prop({ required: true, type: () => String, enum: SigningPositions })
    public position!: SigningPositions;

    @prop({ required: true, ref: () => Position, type: () => Position })
    public specificPosition!: Position;

    // @prop({ required: true, ref: () => SignatureChainLink, type: () => SignatureChainLink }) //? Do we want to make this not required? Or make it potentially undefined?
    // public nextSignature?: Ref<SignatureChainLink>;

    @prop({ required: true, type: () => String }) //? Do we want to make this not required? Or make it potentially undefined?
    public nextSignature?: string;
};

export default SignatureChainLink;
