/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type RegisterEmployeeDto = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    positionName: string;
    departmentName: string;
    signatureLink: string;
    scope: RegisterEmployeeDto.scope;
};

export namespace RegisterEmployeeDto {

    export enum scope {
        BASE_USER = 'BASE_USER',
        ADMIN = 'ADMIN',
    }


}

