import { SignatureEntity } from '@web/client';

export type Assignee = {
  name?: string;
  signed: boolean;
  title: string;
  updatedAt: string;
  signerType: SignatureEntity.signerType;
};

export type AvatarMapProps = {
  assignees: Assignee[];
};
