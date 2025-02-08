/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ConnectEmployeeDto } from './ConnectEmployeeDto';

export type UpdateSignatureSignerDto = {
    signerEmployeeId?: string | null;
    signerPositionId?: string | null;
    signerDepartmentId?: string | null;
    signerEmployeeList?: Array<ConnectEmployeeDto>;
    signerType?: UpdateSignatureSignerDto.signerType;
};

export namespace UpdateSignatureSignerDto {

    export enum signerType {
        POSITION = 'POSITION',
        DEPARTMENT = 'DEPARTMENT',
        USER = 'USER',
        USER_LIST = 'USER_LIST',
    }


}

