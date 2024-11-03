import { IPublicClientApplication } from '@azure/msal-browser';

// for storage in context
export type User = {
  id: string;
  positionId: string;
  departmentId: string;
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

export interface AuthContextType {
  user?: User;
  loading: boolean;
  error?: any;
  login: (email: string, password: string) => void;
  azureLogin: () => void;
  logout: () => void;
}
