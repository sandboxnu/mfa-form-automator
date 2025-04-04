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
  signatureLink: string;
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
  signatureLink: string;
};

export interface AuthContextType {
  user?: User;
  userData?: GraphUser;
  login: (email: string, password: string) => Promise<boolean>;
  azureLogin: () => void;
  completeRegistration: (
    department: string,
    signatureLink: string,
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
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
  formDimensions: { width: number; height: number } | undefined;
  setFormDimensions: Dispatch<
    React.SetStateAction<
      | {
          width: number;
          height: number;
        }
      | undefined
    >
  >;
  inEditMode: boolean;
  setInEditMode: Dispatch<SetStateAction<boolean>>;
  formTemplateUseId: string | null;
  setFormTemplateUseId: Dispatch<SetStateAction<string | null>>;
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
  formInstanceUseId: string | null;
  setFormInstanceUseId: Dispatch<SetStateAction<string | null>>;
}

export interface SignFormInstanceContextType {
  formInstance: FormInstanceEntity | undefined;
  formInstanceError: Error | null;
  isLoading: boolean;
  fields: FormField[][];
  originalPdfLink: string;
  modifiedPdfLink: string;
  groupNumbers: Map<string, number> | undefined;
  signFormInstanceLoading: boolean;
  updateField: (pageNum: number, id: string, data: boolean | string) => void;
  nextSignFormPage: (
    submitLink: string,
    isReviewPage: boolean,
  ) => Promise<void>;
}

export type FormField = TemplateBoxBaseEntity & {
  data: { filled?: boolean; text?: string };
};

export type ContextAssignedGroupData = CreateAssignedGroupDto & {
  name: string;
};
