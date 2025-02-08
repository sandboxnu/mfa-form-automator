/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmployeeEntity } from '../models/EmployeeEntity';
import type { JwtEntity } from '../models/JwtEntity';
import type { RegisterEmployeeDto } from '../models/RegisterEmployeeDto';
import type { UpdateSignatureSignerDto } from '../models/UpdateSignatureSignerDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * @returns string
     * @throws ApiError
     */
    public static appControllerGetHello(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api',
        });
    }

    /**
     * @param requestBody
     * @returns JwtEntity
     * @returns any
     * @throws ApiError
     */
    public static appControllerLogin(
        requestBody: any,
    ): CancelablePromise<JwtEntity | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
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
     * @returns JwtEntity
     * @throws ApiError
     */
    public static appControllerRefresh(): CancelablePromise<JwtEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/refresh',
            errors: {
                400: `Bad Request`,
                403: `Unauthorized Request`,
                422: `Bad Request`,
            },
        });
    }

    /**
     * @param requestBody
     * @returns EmployeeEntity
     * @throws ApiError
     */
    public static appControllerRegister(
        requestBody: RegisterEmployeeDto,
    ): CancelablePromise<EmployeeEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/register',
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
     * @returns any
     * @throws ApiError
     */
    public static appControllerLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/logout',
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static signaturesControllerUpdateSignatureSigner(
        id: string,
        requestBody: UpdateSignatureSignerDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/signatures/{id}/signer',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
