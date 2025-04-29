import { SignerType } from '@web/client';

export type Assignee = {
  name?: string;
  signedAt: string | null;
  title: string;
  signerType: SignerType;
};

export type AvatarMapProps = {
  assignees: Assignee[];
};
