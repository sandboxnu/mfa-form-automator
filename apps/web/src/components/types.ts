import { SignerType } from '@web/client';

export type Assignee = {
  name?: string;
  signed: boolean;
  title: string;
  updatedAt: string;
  signerType: SignerType;
};

export type AvatarMapProps = {
  assignees: Assignee[];
};
