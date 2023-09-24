import { SignatureField } from '@prisma/client';

export class SignatureFieldEntity implements SignatureField {
  // placeholder
  id: string;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  signerPositionId: string | null;
  formTemplateId: string;
}
