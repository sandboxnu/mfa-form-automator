import { Dispatch, SetStateAction } from 'react';
import {
  FormFields,
  FieldGroups,
} from '@web/components/createFormTemplate/createFormTemplateEditor/FormEditor';
import { Scope } from '@web/client';
import { RegisterEmployeeDto } from '@web/client';

// for storage in context
export type User = {
  id: string;
  positionId: string;
  departmentId: string;
  email: string;
  firstName: string;
  lastName: string;
  scope: Scope;
};
// jwt payload returned from server
export type jwtPayload = {
  sub: string;
  positionId: string;
  departmentId: string;
  email: string;
  firstName: string;
  lastName: string;
  scope: Scope;
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
    scope: RegisterEmployeeDto['scope'],
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
  setFormFields: Dispatch<SetStateAction<FormFields>>;
  fieldGroups: FieldGroups;
  setFieldGroups: Dispatch<SetStateAction<FieldGroups>>;
}
