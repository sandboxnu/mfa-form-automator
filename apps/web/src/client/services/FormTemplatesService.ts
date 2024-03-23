/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateFormTemplateDto } from '../models/CreateFormTemplateDto';
import type { FormTemplateEntity } from '../models/FormTemplateEntity';
import type { UpdateFormTemplateDto } from '../models/UpdateFormTemplateDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FormTemplatesService {

    /**
     * @param requestBody 
     * @returns FormTemplateEntity 
     * @throws ApiError
     */
    public static formTemplatesControllerCreate(
requestBody: CreateFormTemplateDto,
): CancelablePromise<FormTemplateEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/form-templates',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Unauthorized Request`,
                422: `Bad Request`,
            },
        });
    }

    /**
     * @param limit Limit on number of form templates to return
     * @returns FormTemplateEntity 
     * @throws ApiError
     */
    public static formTemplatesControllerFindAll(
limit?: number,
): CancelablePromise<Array<FormTemplateEntity>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/form-templates',
            query: {
                'limit': limit,
            },
            errors: {
                400: `Bad Request`,
                403: `Unauthorized Request`,
            },
        });
    }

    /**
     * @param id 
     * @returns FormTemplateEntity 
     * @throws ApiError
     */
    public static formTemplatesControllerFindOne(
id: string,
): CancelablePromise<FormTemplateEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/form-templates/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                403: `Unauthorized Request`,
                404: `Resource not found`,
            },
        });
    }

    /**
     * @param id 
     * @param requestBody 
     * @returns FormTemplateEntity 
     * @throws ApiError
     */
    public static formTemplatesControllerUpdate(
id: string,
requestBody: UpdateFormTemplateDto,
): CancelablePromise<FormTemplateEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/form-templates/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                403: `Unauthorized Request`,
                404: `Resource not found`,
                422: `Bad Request`,
            },
        });
    }

    /**
     * @param id 
     * @returns any 
     * @throws ApiError
     */
    public static formTemplatesControllerRemove(
id: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/form-templates/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                403: `Unauthorized Request`,
                404: `Resource not found`,
            },
        });
    }

}
