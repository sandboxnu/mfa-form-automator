/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PositionBaseEntity } from './PositionBaseEntity';

export type EmployeeEntity = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
    position: PositionBaseEntity;
    positionId: string;
    pswdHash: string | null;
    createdAt: string;
    updatedAt: string;
    refreshToken: string | null;
};
