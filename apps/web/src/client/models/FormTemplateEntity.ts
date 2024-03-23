/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FormInstanceEntity } from './FormInstanceEntity';
import type { SignatureFieldEntity } from './SignatureFieldEntity';

export type FormTemplateEntity = {
    id: string;
    name: string;
    formDocLink: string;
    signatureFields: Array<SignatureFieldEntity>;
    formInstances: Array<FormInstanceEntity>;
    createdAt: string;
    updatedAt: string;
};
