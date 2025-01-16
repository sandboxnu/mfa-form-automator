/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ConnectEmployeeDto } from './ConnectEmployeeDto';

export type CreateSignatureDto = {
  order: number;
  signerEmployeeId: string | null;
  signerPositionId: string | null;
  signerDepartmentId: string | null;
  signerEmployeeList: Array<ConnectEmployeeDto>;
  signerType: Record<string, any>;
};
