import { prop } from "@typegoose/typegoose";
import Form from "./form";
import { SigningPositions } from "@/enums/signing-positions";
import Position from "./position";

class SignatureChainLink {

    @prop({ required: true, ref: () => Form, type: () => Form })
    public form!: Form;

    @prop({ required: true, type: () => String, enum: SigningPositions })
    public position!: SigningPositions;

    @prop({ required: true, ref: () => Position, type: () => Position })
    public specificPosition!: Position; //! Only thing I'm confused about is why a SignatureChainLink has a specific position if its supposed to be generic?

    @prop({ required: true, type: () => String })
    public nextSignature?: string;
};

export default SignatureChainLink;
