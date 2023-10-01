import { Position } from "@prisma/client";

export class PositionEntity implements Position {
  // placeholder
  id: string;
  name: string;
  single: boolean;
  createdAt: Date;
  updatedAt: Date;
  signatureFields: any[];
  signatures: any[];
}
