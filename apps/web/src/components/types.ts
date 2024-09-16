export type Assignee = {
  name?: string;
  signed: boolean;
  title: string;
  updatedAt: string;
};

export type AvatarMapProps = {
  assignees: Assignee[];
};
