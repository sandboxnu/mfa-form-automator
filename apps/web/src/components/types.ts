export type Assignee = {
  name?: string;
  signed: boolean;
  title: string;
  updatedAt: Date;
  signerType: 'POSITION' | 'DEPARTMENT' | 'USER' | 'USER_LIST';
};

export type AvatarMapProps = {
  assignees: Assignee[];
};
