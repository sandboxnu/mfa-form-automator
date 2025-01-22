/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DepartmentEntity } from './DepartmentEntity';
import type { EmployeeBaseEntity } from './EmployeeBaseEntity';
import type { PositionBaseEntity } from './PositionBaseEntity';

export type SignatureEntity = {
    id: string;
    order: number;
    signed: boolean;
    signedDocLink: string | null;
    createdAt: string;
    updatedAt: string;
    signerPositionId: string | null;
    signerPosition: PositionBaseEntity | null;
    signerDepartmentId: string | null;
    signerDepartment: DepartmentEntity | null;
    signerEmployeeId: string | null;
    signerEmployee: EmployeeBaseEntity | null;
    signerEmployeeList: Array<EmployeeBaseEntity>;
    signingEmployeeId: string | null;
    signingEmployee: EmployeeBaseEntity | null;
    signerType: SignatureEntity.signerType;
    formInstanceId: string;
};

export namespace SignatureEntity {

    export enum signerType {
        POSITION = 'POSITION',
        DEPARTMENT = 'DEPARTMENT',
        USER = 'USER',
        USER_LIST = 'USER_LIST',
    }


}

