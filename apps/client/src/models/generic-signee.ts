import { SigningPositions } from "apps/client/src/enums/signing-positions";
import Position from "./position";

class GenericSignee {
  public position!: SigningPositions;

  public specificPosition?: Position;
}

export default GenericSignee;
