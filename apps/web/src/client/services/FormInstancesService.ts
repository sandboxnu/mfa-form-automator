/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateFormInstanceDto } from '../models/CreateFormInstanceDto';
import type { FormInstanceEntity } from '../models/FormInstanceEntity';
import type { UpdateFormInstanceDto } from '../models/UpdateFormInstanceDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FormInstancesService {

    /**
     * @param requestBody
     * @returns FormInstanceEntity
     * @throws ApiError
     */
    public static formInstancesControllerCreate(
        requestBody: CreateFormInstanceDto,
    ): CancelablePromise<FormInstanceEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/form-instances',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Unauthorized Request`,
                422: `Bad Request`,
            },
        });
    }

    /**
     * @param limit
     * @returns FormInstanceEntity
     * @throws ApiError
     */
    public static formInstancesControllerFindAll(
        limit: number,
    ): CancelablePromise<Array<FormInstanceEntity>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/form-instances',
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
     * @returns FormInstanceEntity
     * @throws ApiError
     */
    public static formInstancesControllerFindOne(
        id: string,
    ): CancelablePromise<FormInstanceEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/form-instances/{id}',
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
     * @returns FormInstanceEntity
     * @throws ApiError
     */
    public static formInstancesControllerUpdate(
        id: string,
        requestBody: UpdateFormInstanceDto,
    ): CancelablePromise<FormInstanceEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/form-instances/{id}',
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
    public static formInstancesControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/form-instances/{id}',
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
