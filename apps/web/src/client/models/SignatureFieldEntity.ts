/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PositionBaseEntity } from './PositionBaseEntity';

export type SignatureFieldEntity = {
    id: string;
    name: string;
    order: number;
    signerPosition: PositionBaseEntity | null;
    signerPositionId: string | null;
    formTemplateId: string;
    createdAt: string;
    updatedAt: string;
};
