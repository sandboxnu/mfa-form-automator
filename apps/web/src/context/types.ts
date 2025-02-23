import { Dispatch, SetStateAction } from 'react';
import { AssignedGroupData } from 'apps/web/src/components/createFormInstance/types'
import {
  FormFields,
  FieldGroups,
} from '@web/components/createFormTemplate/types';
import { FormTemplateEntity, Scope } from '@web/client';
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
  pdfFile: File | null;
  setPdfFile: Dispatch<SetStateAction<File | null>>;
  formFields: FormFields;
  setFormFields: Dispatch<SetStateAction<FormFields>>;
  fieldGroups: FieldGroups;
  setFieldGroups: Dispatch<SetStateAction<FieldGroups>>;
}

export interface CreateFormInstanceContextType {
  formInstanceName: string | null;
  formInstanceDescription: string | null;
  setFormInstanceName: Dispatch<SetStateAction<string | null>>;
  setFormInstanceDescription: Dispatch<SetStateAction<string | null>>;
  formTemplate: FormTemplateEntity | null;
  setFormTemplate: Dispatch<SetStateAction<FormTemplateEntity | null>>;
  assignedGroupsData: AssignedGroupData[];
  setAssignedGroupsData: Dispatch<SetStateAction<AssignedGroupData[]>>;
}
