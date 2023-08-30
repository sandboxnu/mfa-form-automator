/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateEmployeeDto } from '../models/CreateEmployeeDto';
import type { CreateFormInstanceDto } from '../models/CreateFormInstanceDto';
import type { CreateFormTemplateDto } from '../models/CreateFormTemplateDto';
import type { CreatePositionDto } from '../models/CreatePositionDto';
import type { CreateSignatureDto } from '../models/CreateSignatureDto';
import type { CreateSignatureFieldDto } from '../models/CreateSignatureFieldDto';
import type { EmployeeEntity } from '../models/EmployeeEntity';
import type { UpdateEmployeeDto } from '../models/UpdateEmployeeDto';
import type { UpdateFormInstanceDto } from '../models/UpdateFormInstanceDto';
import type { UpdateFormTemplateDto } from '../models/UpdateFormTemplateDto';
import type { UpdatePositionDto } from '../models/UpdatePositionDto';
import type { UpdateSignatureDto } from '../models/UpdateSignatureDto';
import type { UpdateSignatureFieldDto } from '../models/UpdateSignatureFieldDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * @returns any
     * @throws ApiError
     */
    public static appControllerGetHello(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }

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
            url: '/employees',
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
     * @returns EmployeeEntity
     * @throws ApiError
     */
    public static employeesControllerFindAll(
        limit: number,
    ): CancelablePromise<Array<EmployeeEntity>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/employees',
            path: {
                'limit': limit,
            },
            errors: {
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
            url: '/employees/{id}',
            path: {
                'id': id,
            },
            errors: {
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
            url: '/employees/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
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
            url: '/employees/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Unauthorized Request`,
                404: `Resource not found`,
            },
        });
    }

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static positionsControllerCreate(
        requestBody: CreatePositionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/positions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static positionsControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/positions',
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static positionsControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/positions/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static positionsControllerUpdate(
        id: string,
        requestBody: UpdatePositionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/positions/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
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
            url: '/positions/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static signatureFieldsControllerCreate(
        requestBody: CreateSignatureFieldDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/signature-fields',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static signatureFieldsControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/signature-fields',
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static signatureFieldsControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/signature-fields/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static signatureFieldsControllerUpdate(
        id: string,
        requestBody: UpdateSignatureFieldDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/signature-fields/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static signatureFieldsControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/signature-fields/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static signaturesControllerCreate(
        requestBody: CreateSignatureDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/signatures',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static signaturesControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/signatures',
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static signaturesControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/signatures/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static signaturesControllerUpdate(
        id: string,
        requestBody: UpdateSignatureDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/signatures/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static signaturesControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/signatures/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static formInstancesControllerCreate(
        requestBody: CreateFormInstanceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/form-instances',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static formInstancesControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/form-instances',
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static formInstancesControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/form-instances/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static formInstancesControllerUpdate(
        id: string,
        requestBody: UpdateFormInstanceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/form-instances/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
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
        });
    }

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static formTemplatesControllerCreate(
        requestBody: CreateFormTemplateDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/form-templates',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static formTemplatesControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/form-templates',
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static formTemplatesControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/form-templates/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static formTemplatesControllerUpdate(
        id: string,
        requestBody: UpdateFormTemplateDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/form-templates/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
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
            url: '/form-templates/{id}',
            path: {
                'id': id,
            },
        });
    }

}
