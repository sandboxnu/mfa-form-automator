import {
  FieldGroups,
  FormFields,
} from '@web/components/createFormTemplate/createFormTemplateEditor/FormEditor';
import { Dispatch, Ref, SetStateAction } from 'react';

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
    signatureLink: string,
  ) => void;
  logout: () => void;
}

export interface CreateFormTemplateContextType {
  formTemplateName: string | null;
  formTemplateDescription: string | null;
  setFormTemplateName: Dispatch<SetStateAction<string | null>>;
  setFormTemplateDescription: Dispatch<SetStateAction<string | null>>;
  useBlob: any;
  formFields: FormFields;
  setFormFields: React.Dispatch<React.SetStateAction<FormFields>>;
  fieldGroups: FieldGroups;
  setFieldGroups: React.Dispatch<React.SetStateAction<FieldGroups>>;
}
