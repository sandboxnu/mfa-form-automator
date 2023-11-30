/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FormTemplateBaseEntity } from './FormTemplateBaseEntity';
import type { SignatureEntity } from './SignatureEntity';

export type FormInstanceEntity = {
    id: string;
    name: string;
    formDocLink: string;
    completed: boolean;
    markedCompleted: boolean;
    createdAt: string;
    updatedAt: string;
    completedAt?: string | null;
    markedCompletedAt?: string | null;
    originator: Record<string, any>;
    formTemplate: FormTemplateBaseEntity;
    signatures: Array<SignatureEntity>;
    originatorId: string;
    formTemplateId: string;
};

