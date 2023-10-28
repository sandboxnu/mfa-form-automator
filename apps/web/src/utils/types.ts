export type Assignee = {
  name: string;
  email: string;
  signed: boolean;
};

export type Form = {
  name: string;
  assignees: Assignee[];
};

export type FormInstance = {
  name: string;
  originator: string;
  assignees: Assignee[];
};

// for storage in context
export type User = {
  firstName: string;
  lastName: string;
  email: string;
}