import {
  EmployeeScope,
  SignatureBoxFieldType,
  SignerType,
} from '@prisma/client';
import { ConnectEmployeeDto } from '../src/assigned-group/dto/create-assigned-group.dto';

export type DepartmentData = {
  id: string;
  name: string;
};

export type PositionData = {
  id: string;
  name: string;
  departmentId: string;
};

export type EmployeeData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  positionId: string;
  signatureLink: string;
  scope: EmployeeScope;
};

export type TemplateBoxData = {
  id: string;
  type: SignatureBoxFieldType;
  x_coordinate: number;
  y_coordinate: number;
};

export type FieldGroupData = {
  id: string;
  name: string;
  order: number;
  templateBoxes: TemplateBoxData[];
};

export type FormTemplateData = {
  id: string;
  name: string;
  formDocLink: string;
  fieldGroups: FieldGroupData[];
};

export type AssignedGroupData = {
  id: string;
  order: number;
  signerType: SignerType;
  signerEmployeeId?: string;
  signerPositionId?: string;
  signerDepartmentId?: string;
  signerEmployeeList?: ConnectEmployeeDto[];
  fieldGroupId: string;
};

export type FormInstanceData = {
  id: string;
  name: string;
  formDocLink: string;
  originatorId: string;
  formTemplateId: string;
  assignedGroups: AssignedGroupData[];
};
