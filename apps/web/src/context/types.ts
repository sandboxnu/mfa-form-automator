import { Ref } from 'react';

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
  departmentId: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
};

export interface AuthContextType {
  user?: User;
  loading: boolean;
  userData: any;
  error?: any;
  login: (email: string, password: string) => void;
  azureLogin: () => void;
  completeRegistration: (
    email: string,
    password: string,
    position: string,
    department: string,
  ) => void;
  logout: () => void;
}

export interface CreateFormTemplateContextType {
  formTemplateName: string;
  formTemplateDescription: string;
  localBlobData: any;
  blobInputRef: Ref<HTMLInputElement>;
  setFormTemplateName: (formTemplateName: string) => void;
  setFormTemplateDescription: (formTemplateDescription: string) => void;
}
