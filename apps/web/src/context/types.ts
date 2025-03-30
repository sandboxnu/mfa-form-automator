import {
  CreateAssignedGroupDto,
  FormInstanceEntity,
  FormTemplateEntity,
  Scope,
  TemplateBoxBaseEntity,
} from '@web/client';
import {
  FieldGroups,
  FormFields,
} from '@web/components/createFormTemplate/types';
import { GraphUser } from '@web/graph';
import { Dispatch, SetStateAction } from 'react';

// for storage in context
export type User = {
  id: string;
  positionId: string | null;
  departmentId: string | null;
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
  userData?: GraphUser;
  login: (email: string, password: string) => void;
  azureLogin: () => void;
  completeRegistration: (
    department: string,
    signatureLink: string,
  ) => Promise<void>;
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
  assignedGroupData: ContextAssignedGroupData[];
  setAssignedGroupData: Dispatch<SetStateAction<ContextAssignedGroupData[]>>;
}

export interface SignFormInstanceContextType {
  formInstance: FormInstanceEntity | undefined; // Replace 'any' with your actual formInstance type
  formInstanceError: Error | null;
  isLoading: boolean;
  fields: FormField[][];
  pdfLink: string;
  formTemplateName: string;
  setFields: Dispatch<SetStateAction<FormField[][]>>;
  groupNumber: number;
  updateField: (pageNum: number, id: string, data: boolean | string) => void;
  updatePDF: () => Promise<void>;
}

export type Checkbox = {
  isChecked: boolean;
  id: string;
  x: number;
  y: number;
};

export type Signature = {
  isSigned: boolean;
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type FormField = TemplateBoxBaseEntity & {
  data: { filled?: boolean; text?: string };
};

export type ContextAssignedGroupData = CreateAssignedGroupDto & {
  name: string;
};
