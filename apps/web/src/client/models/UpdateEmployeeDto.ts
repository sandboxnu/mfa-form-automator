/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateEmployeeDto = {
    firstName?: string;
    lastName?: string;
    positionId?: string;
    signatureLink?: string;
    scope?: UpdateEmployeeDto.scope;
};

export namespace UpdateEmployeeDto {

    export enum scope {
        BASE_USER = 'BASE_USER',
        ADMIN = 'ADMIN',
    }


}

