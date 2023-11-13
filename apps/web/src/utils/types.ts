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
  id: string;
  positionId: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
};

// jwt payload returned from server
export type jwtPayload = {
  sub: string;
  positionId: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
};
