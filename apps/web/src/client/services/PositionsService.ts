/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePositionDto } from '../models/CreatePositionDto';
import type { PositionEntity } from '../models/PositionEntity';
import type { UpdatePositionDto } from '../models/UpdatePositionDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PositionsService {

    /**
     * @param requestBody
     * @returns PositionEntity
     * @throws ApiError
     */
    public static positionsControllerCreate(
        requestBody: CreatePositionDto,
    ): CancelablePromise<PositionEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/positions',
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
     * @returns PositionEntity
     * @throws ApiError
     */
    public static positionsControllerFindAll(
        limit?: number,
    ): CancelablePromise<Array<PositionEntity>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/positions',
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
     * @param requestBody
     * @returns PositionEntity
     * @throws ApiError
     */
    public static positionsControllerCreateWithDepartment(
        requestBody: string,
    ): CancelablePromise<PositionEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/positions/department',
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
     * @param id
     * @returns PositionEntity
     * @throws ApiError
     */
    public static positionsControllerFindOne(
        id: string,
    ): CancelablePromise<PositionEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/positions/{id}',
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
     * @returns PositionEntity
     * @throws ApiError
     */
    public static positionsControllerUpdate(
        id: string,
        requestBody: UpdatePositionDto,
    ): CancelablePromise<PositionEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/positions/{id}',
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
    public static positionsControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/positions/{id}',
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
     * @param name
     * @param departmentId
     * @returns PositionEntity
     * @throws ApiError
     */
    public static positionsControllerFindOneByNameInDepartment(
        name: string,
        departmentId: string,
    ): CancelablePromise<PositionEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/positions/name/{name}',
            path: {
                'name': name,
            },
            query: {
                'departmentId': departmentId,
            },
            errors: {
                400: `Bad Request`,
                403: `Unauthorized Request`,
                404: `Resource not found`,
            },
        });
    }

}
