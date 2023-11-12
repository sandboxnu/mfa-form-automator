/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DepartmentEntity } from './DepartmentEntity';
import type { EmployeeBaseEntity } from './EmployeeBaseEntity';

export type PositionEntity = {
  id: string;
  name: string;
  single: boolean;
  department: DepartmentEntity;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
  employees?: Array<EmployeeBaseEntity>;
};
