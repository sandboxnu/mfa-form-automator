/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateEmployeeDto = {
    firstName: string;
    lastName: string;
    positionId: string;
    email: string;
    password: string;
    signatureLink: string;
    scope: CreateEmployeeDto.scope;
};

export namespace CreateEmployeeDto {

    export enum scope {
        BASE_USER = 'BASE_USER',
        ADMIN = 'ADMIN',
    }


}

