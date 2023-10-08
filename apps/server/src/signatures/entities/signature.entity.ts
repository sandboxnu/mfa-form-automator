import { Signature } from '@prisma/client';

export class SignatureEntity implements Signature {
  id: string;
  order: number;
  signed: boolean;
  signedDocLink: string | null;
  createdAt: Date;
  updatedAt: Date;
  signerPositionId: string | null;
  userSignedById: string | null;
  formInstanceId: string;
}
