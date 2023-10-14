import { Signature } from '@prisma/client';

export class SignatureEntity implements Signature {
  // placeholder
  id: string;
  order: number;
  signed: boolean;
  signedDocLink: string;
  createdAt: Date;
  updatedAt: Date;
  signerPosition: any;
  signerPositionId: string;
  userSignedBy: any;
  userSignedById: string;
  formInstance: any;
  formInstanceId: string;
}
