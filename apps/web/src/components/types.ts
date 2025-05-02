import { SignerType } from '@web/client';

export type Assignee = {
  signedAt: string | null;
  title: string;
  signerType: SignerType;
  isActive: boolean;
};

export type AvatarMapProps = {
  assignees: Assignee[];
};
