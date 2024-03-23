/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateEmployeeDto } from '../models/CreateEmployeeDto';
import type { EmployeeEntity } from '../models/EmployeeEntity';
import type { UpdateEmployeeDto } from '../models/UpdateEmployeeDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EmployeesService {

    /**
     * @param requestBody
     * @returns EmployeeEntity
     * @throws ApiError
     */
    public static employeesControllerCreate(
        requestBody: CreateEmployeeDto,
    ): CancelablePromise<EmployeeEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/employees',
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
     * @param limit Limit on number of positions to return
     * @returns EmployeeEntity
     * @throws ApiError
     */
    public static employeesControllerFindAll(
        limit?: number,
    ): CancelablePromise<Array<EmployeeEntity>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/employees',
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
     * @returns EmployeeEntity
     * @throws ApiError
     */
    public static employeesControllerFindMe(): CancelablePromise<EmployeeEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/employees/me',
            errors: {
                400: `Bad Request`,
                403: `Unauthorized Request`,
            },
        });
    }

    /**
     * @param id
     * @returns EmployeeEntity
     * @throws ApiError
     */
    public static employeesControllerFindOne(
        id: string,
    ): CancelablePromise<EmployeeEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/employees/{id}',
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
     * @returns EmployeeEntity
     * @throws ApiError
     */
    public static employeesControllerUpdate(
        id: string,
        requestBody: UpdateEmployeeDto,
    ): CancelablePromise<EmployeeEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/employees/{id}',
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
    public static employeesControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/employees/{id}',
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
