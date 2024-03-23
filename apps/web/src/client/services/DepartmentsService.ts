/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDepartmentDto } from '../models/CreateDepartmentDto';
import type { DepartmentEntity } from '../models/DepartmentEntity';
import type { UpdateDepartmentDto } from '../models/UpdateDepartmentDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DepartmentsService {

    /**
     * @param requestBody 
     * @returns DepartmentEntity 
     * @throws ApiError
     */
    public static departmentsControllerCreate(
requestBody: CreateDepartmentDto,
): CancelablePromise<DepartmentEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/departments',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                403: `Unauthorized Request`,
                422: `Bad Request`,
            },
        });
    }

    /**
     * @param limit 
     * @returns DepartmentEntity 
     * @throws ApiError
     */
    public static departmentsControllerFindAll(
limit: number,
): CancelablePromise<Array<DepartmentEntity>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/departments',
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
     * @returns DepartmentEntity 
     * @throws ApiError
     */
    public static departmentsControllerFindOne(
id: string,
): CancelablePromise<DepartmentEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/departments/{id}',
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
     * @returns DepartmentEntity 
     * @throws ApiError
     */
    public static departmentsControllerUpdate(
id: string,
requestBody: UpdateDepartmentDto,
): CancelablePromise<DepartmentEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/departments/{id}',
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
    public static departmentsControllerRemove(
id: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/departments/{id}',
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
