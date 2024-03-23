/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSignatureFieldDto } from '../models/CreateSignatureFieldDto';
import type { SignatureFieldEntity } from '../models/SignatureFieldEntity';
import type { UpdateSignatureFieldDto } from '../models/UpdateSignatureFieldDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SignatureFieldsService {
  /**
   * @param requestBody
   * @returns SignatureFieldEntity
   * @throws ApiError
   */
  public static signatureFieldsControllerCreate(
    requestBody: CreateSignatureFieldDto,
  ): CancelablePromise<SignatureFieldEntity> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/signature-fields',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        403: `Unauthorized Request`,
        422: `Bad Request`,
      },
    });
  }

<<<<<<< HEAD
  /**
   * @param limit
   * @returns SignatureFieldEntity
   * @throws ApiError
   */
  public static signatureFieldsControllerFindAll(
    limit: number,
  ): CancelablePromise<Array<SignatureFieldEntity>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/signature-fields',
      query: {
        limit: limit,
      },
      errors: {
        400: `Bad Request`,
        403: `Unauthorized Request`,
      },
    });
  }

  /**
   * @param id
   * @returns SignatureFieldEntity
   * @throws ApiError
   */
  public static signatureFieldsControllerFindOne(
    id: string,
  ): CancelablePromise<SignatureFieldEntity> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/signature-fields/{id}',
      path: {
        id: id,
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
   * @returns SignatureFieldEntity
   * @throws ApiError
   */
  public static signatureFieldsControllerUpdate(
    id: string,
    requestBody: UpdateSignatureFieldDto,
  ): CancelablePromise<SignatureFieldEntity> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/signature-fields/{id}',
      path: {
        id: id,
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
=======
    /**
     * @param requestBody
     * @returns SignatureFieldEntity
     * @throws ApiError
     */
    public static signatureFieldsControllerCreate(
        requestBody: CreateSignatureFieldDto,
    ): CancelablePromise<SignatureFieldEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/signature-fields',
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
     * @returns SignatureFieldEntity
     * @throws ApiError
     */
    public static signatureFieldsControllerFindAll(
        limit: number,
    ): CancelablePromise<Array<SignatureFieldEntity>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/signature-fields',
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
     * @returns SignatureFieldEntity
     * @throws ApiError
     */
    public static signatureFieldsControllerFindOne(
        id: string,
    ): CancelablePromise<SignatureFieldEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/signature-fields/{id}',
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
     * @returns SignatureFieldEntity
     * @throws ApiError
     */
    public static signatureFieldsControllerUpdate(
        id: string,
        requestBody: UpdateSignatureFieldDto,
    ): CancelablePromise<SignatureFieldEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/signature-fields/{id}',
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
    public static signatureFieldsControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/signature-fields/{id}',
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
>>>>>>> parent of 18fbc16 (dynamic email sending: admin notified when user signs)

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
      url: '/api/v1/signature-fields/{id}',
      path: {
        id: id,
      },
      errors: {
        400: `Bad Request`,
        403: `Unauthorized Request`,
        404: `Resource not found`,
      },
    });
  }
}
