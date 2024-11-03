export type Assignee = {
  name?: string;
  signed: boolean;
  title: string;
  updatedAt: string;
  signerType: string;
};

export type AvatarMapProps = {
  assignees: Assignee[];
};
