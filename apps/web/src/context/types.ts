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
