import Position from "./position";

class SignatureRequestLink {
    public position!: Position;

    public canSign: boolean = false;

    public isSigned: boolean = false;
};

export default SignatureRequestLink;
