import Position from "./position";

class SignatureRequest {
    public position!: Position;

    public canSign: boolean = false;

    public isSigned: boolean = false;
};

export default SignatureRequest;
