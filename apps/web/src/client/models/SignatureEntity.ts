/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EmployeeBaseEntity } from './EmployeeBaseEntity';
import type { PositionBaseEntity } from './PositionBaseEntity';

export type SignatureEntity = {
    id: string;
    order: number;
    signed: boolean;
    signedDocLink: string | null;
    createdAt: string;
    updatedAt: string;
    signerPositionId: string;
    signerPosition: PositionBaseEntity;
    userSignedById?: string | null;
    userSignedBy?: EmployeeBaseEntity | null;
    formInstanceId: string;
};
