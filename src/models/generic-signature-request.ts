import { SigningPositions } from "@/enums/signing-positions";
import Position from "./position";

class GenericSignatureRequest {
    public position!: SigningPositions;

    public specificPosition?: Position; 
}

export default GenericSignatureRequest;
