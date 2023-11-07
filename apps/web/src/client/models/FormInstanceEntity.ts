/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FormTemplateBaseEntity } from './FormTemplateBaseEntity';

export type FormInstanceEntity = {
    id: string;
    name: string;
    formDocLink: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    originator: Record<string, any>;
    formTemplate: FormTemplateBaseEntity;
    signatures: Array<string>;
};
