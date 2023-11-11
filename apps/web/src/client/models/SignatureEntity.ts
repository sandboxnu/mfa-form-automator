/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PositionEntity } from './PositionEntity';

export type SignatureEntity = {
    id: string;
    order: number;
    signed: boolean;
    signedDocLink: Record<string, any>;
    createdAt: string;
    updatedAt: string;
    signerPositionId: string;
    signerPosition: PositionEntity;
    userSignedById: Record<string, any>;
    userSignedBy: Record<string, any>;
};

