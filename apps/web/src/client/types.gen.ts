// This file is auto-generated by @hey-api/openapi-ts

export type JwtEntity = {
    accessToken: string;
};

export type RegisterEmployeeDto = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    positionName: string;
    departmentName: string;
    signatureLink: string;
};

export type DepartmentEntity = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

export type PositionBaseEntity = {
    id: string;
    name: string;
    single: boolean;
    department: DepartmentEntity;
    departmentId: string;
    createdAt: Date;
    updatedAt: Date;
};

export type EmployeeEntity = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
    signatureLink: string;
    position: PositionBaseEntity;
    positionId: string;
    pswdHash: string | null;
    createdAt: Date;
    updatedAt: Date;
    refreshToken: string | null;
};

export type CreateEmployeeDto = {
    firstName: string;
    lastName: string;
    positionId: string;
    email: string;
    password: string;
    signatureLink: string;
};

export type UpdateEmployeeDto = {
    firstName?: string;
    lastName?: string;
    positionId?: string;
    signatureLink?: string;
};

export type CreatePositionDto = {
    name: string;
    departmentId: string;
};

export type EmployeeBaseEntity = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
    signatureLink: string;
    positionId: string;
    pswdHash: string | null;
    createdAt: Date;
    updatedAt: Date;
    refreshToken: string | null;
};

export type PositionEntity = {
    id: string;
    name: string;
    single: boolean;
    department: DepartmentEntity;
    departmentId: string;
    createdAt: Date;
    updatedAt: Date;
    employees?: Array<EmployeeBaseEntity>;
};

export type UpdatePositionDto = {
    name?: string;
    departmentId?: string;
};

export type CreateSignatureFieldDto = {
    name: string;
    order: number;
    formTemplateId?: string;
};

export type SignatureFieldEntity = {
    id: string;
    name: string;
    order: number;
    formTemplateId: string;
    createdAt: Date;
    updatedAt: Date;
};

export type UpdateSignatureFieldDto = {
    name?: string;
    order?: number;
    formTemplateId?: string;
};

export type ConnectEmployeeDto = {
    id: string;
};

export type UpdateSignatureSignerDto = {
    signerEmployeeId?: string | null;
    signerPositionId?: string | null;
    signerDepartmentId?: string | null;
    signerEmployeeList?: Array<ConnectEmployeeDto>;
    signerType?: 'POSITION' | 'DEPARTMENT' | 'USER' | 'USER_LIST';
};

export type CreateDepartmentDto = {
    name: string;
};

export type UpdateDepartmentDto = {
    name?: string;
};

export type CreateSignatureDto = {
    order: number;
    signerEmployeeId: string | null;
    signerPositionId: string | null;
    signerDepartmentId: string | null;
    signerEmployeeList: Array<ConnectEmployeeDto>;
    signerType: 'POSITION' | 'DEPARTMENT' | 'USER' | 'USER_LIST';
};

export type CreateFormInstanceDto = {
    name: string;
    signatures: Array<CreateSignatureDto>;
    originatorId: string;
    formTemplateId: string;
    formDocLink: string;
};

export type FormTemplateBaseEntity = {
    id: string;
    name: string;
    formDocLink: string;
    createdAt: Date;
    updatedAt: Date;
};

export type SignatureEntity = {
    id: string;
    order: number;
    signed: boolean;
    signedDocLink: string | null;
    createdAt: Date;
    updatedAt: Date;
    signerPositionId: string | null;
    signerPosition: PositionBaseEntity | null;
    signerDepartmentId: string | null;
    signerDepartment: DepartmentEntity | null;
    signerEmployeeId: string | null;
    signerEmployee: EmployeeBaseEntity | null;
    signerEmployeeList: Array<EmployeeBaseEntity>;
    signingEmployeeId: string | null;
    signingEmployee: EmployeeBaseEntity | null;
    signerType: 'POSITION' | 'DEPARTMENT' | 'USER' | 'USER_LIST';
    formInstanceId: string;
};

export type FormInstanceEntity = {
    id: string;
    name: string;
    formDocLink: string;
    completed: boolean;
    markedCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date | null;
    markedCompletedAt?: Date | null;
    originator: EmployeeEntity;
    formTemplate: FormTemplateBaseEntity;
    signatures: Array<SignatureEntity>;
    originatorId: string;
    formTemplateId: string;
};

export type UpdateFormInstanceDto = {
    name?: string;
    formDocLink?: string;
};

export type CreateFormTemplateDto = {
    name: string;
    formDocLink: string;
    signatureFields: Array<CreateSignatureFieldDto>;
};

export type FormTemplateEntity = {
    id: string;
    name: string;
    formDocLink: string;
    signatureFields: Array<SignatureFieldEntity>;
    formInstances: Array<FormInstanceEntity>;
    createdAt: Date;
    updatedAt: Date;
};

export type UpdateFormTemplateDto = {
    name?: string;
    formDocLink?: string;
};

export type AppControllerGetHelloData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api';
};

export type AppControllerGetHelloResponses = {
    200: string;
};

export type AppControllerGetHelloResponse = AppControllerGetHelloResponses[keyof AppControllerGetHelloResponses];

export type AppControllerLoginData = {
    body: {
        username?: string;
        password?: string;
    };
    path?: never;
    query?: never;
    url: '/api/auth/login';
};

export type AppControllerLoginErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type AppControllerLoginResponses = {
    201: JwtEntity;
};

export type AppControllerLoginResponse = AppControllerLoginResponses[keyof AppControllerLoginResponses];

export type AppControllerRefreshData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/auth/refresh';
};

export type AppControllerRefreshErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type AppControllerRefreshResponses = {
    200: JwtEntity;
};

export type AppControllerRefreshResponse = AppControllerRefreshResponses[keyof AppControllerRefreshResponses];

export type AppControllerRegisterData = {
    body: RegisterEmployeeDto;
    path?: never;
    query?: never;
    url: '/api/auth/register';
};

export type AppControllerRegisterErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type AppControllerRegisterResponses = {
    200: EmployeeEntity;
    201: EmployeeEntity;
};

export type AppControllerRegisterResponse = AppControllerRegisterResponses[keyof AppControllerRegisterResponses];

export type AppControllerLogoutData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/auth/logout';
};

export type AppControllerLogoutResponses = {
    200: unknown;
};

export type EmployeesControllerFindAllData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Limit on number of positions to return
         */
        limit?: number;
    };
    url: '/api/employees';
};

export type EmployeesControllerFindAllErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
};

export type EmployeesControllerFindAllResponses = {
    200: Array<EmployeeEntity>;
};

export type EmployeesControllerFindAllResponse = EmployeesControllerFindAllResponses[keyof EmployeesControllerFindAllResponses];

export type EmployeesControllerCreateData = {
    body: CreateEmployeeDto;
    path?: never;
    query?: never;
    url: '/api/employees';
};

export type EmployeesControllerCreateErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type EmployeesControllerCreateResponses = {
    201: EmployeeEntity;
};

export type EmployeesControllerCreateResponse = EmployeesControllerCreateResponses[keyof EmployeesControllerCreateResponses];

export type EmployeesControllerFindMeData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/employees/me';
};

export type EmployeesControllerFindMeErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
};

export type EmployeesControllerFindMeResponses = {
    200: EmployeeEntity;
};

export type EmployeesControllerFindMeResponse = EmployeesControllerFindMeResponses[keyof EmployeesControllerFindMeResponses];

export type EmployeesControllerRemoveData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/employees/{id}';
};

export type EmployeesControllerRemoveErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
};

export type EmployeesControllerRemoveResponses = {
    200: unknown;
};

export type EmployeesControllerFindOneData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/employees/{id}';
};

export type EmployeesControllerFindOneErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
};

export type EmployeesControllerFindOneResponses = {
    200: EmployeeEntity;
};

export type EmployeesControllerFindOneResponse = EmployeesControllerFindOneResponses[keyof EmployeesControllerFindOneResponses];

export type EmployeesControllerUpdateData = {
    body: UpdateEmployeeDto;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/employees/{id}';
};

export type EmployeesControllerUpdateErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type EmployeesControllerUpdateResponses = {
    200: EmployeeEntity;
};

export type EmployeesControllerUpdateResponse = EmployeesControllerUpdateResponses[keyof EmployeesControllerUpdateResponses];

export type PositionsControllerFindAllData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Limit on number of positions to return
         */
        limit?: number;
    };
    url: '/api/positions';
};

export type PositionsControllerFindAllErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
};

export type PositionsControllerFindAllResponses = {
    200: Array<PositionEntity>;
};

export type PositionsControllerFindAllResponse = PositionsControllerFindAllResponses[keyof PositionsControllerFindAllResponses];

export type PositionsControllerCreateData = {
    body: CreatePositionDto;
    path?: never;
    query?: never;
    url: '/api/positions';
};

export type PositionsControllerCreateErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type PositionsControllerCreateResponses = {
    201: PositionEntity;
};

export type PositionsControllerCreateResponse = PositionsControllerCreateResponses[keyof PositionsControllerCreateResponses];

export type PositionsControllerFindAllInDepartmentData = {
    body?: never;
    path: {
        departmentId: string;
    };
    query?: {
        /**
         * Limit on number of positions to return
         */
        limit?: number;
    };
    url: '/api/positions/department/{departmentId}';
};

export type PositionsControllerFindAllInDepartmentErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
};

export type PositionsControllerFindAllInDepartmentResponses = {
    200: Array<PositionEntity>;
};

export type PositionsControllerFindAllInDepartmentResponse = PositionsControllerFindAllInDepartmentResponses[keyof PositionsControllerFindAllInDepartmentResponses];

export type PositionsControllerFindAllInDepartmentNameData = {
    body?: never;
    path: {
        departmentName: string;
    };
    query: {
        limit: number;
    };
    url: '/api/positions/departmentName/{departmentName}';
};

export type PositionsControllerFindAllInDepartmentNameErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
};

export type PositionsControllerFindAllInDepartmentNameResponses = {
    200: Array<PositionEntity>;
};

export type PositionsControllerFindAllInDepartmentNameResponse = PositionsControllerFindAllInDepartmentNameResponses[keyof PositionsControllerFindAllInDepartmentNameResponses];

export type PositionsControllerRemoveData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/positions/{id}';
};

export type PositionsControllerRemoveErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
};

export type PositionsControllerRemoveResponses = {
    200: unknown;
};

export type PositionsControllerFindOneData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/positions/{id}';
};

export type PositionsControllerFindOneErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
};

export type PositionsControllerFindOneResponses = {
    200: PositionEntity;
};

export type PositionsControllerFindOneResponse = PositionsControllerFindOneResponses[keyof PositionsControllerFindOneResponses];

export type PositionsControllerUpdateData = {
    body: UpdatePositionDto;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/positions/{id}';
};

export type PositionsControllerUpdateErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type PositionsControllerUpdateResponses = {
    200: PositionEntity;
};

export type PositionsControllerUpdateResponse = PositionsControllerUpdateResponses[keyof PositionsControllerUpdateResponses];

export type PositionsControllerFindOneByNameInDepartmentData = {
    body?: never;
    path: {
        name: string;
    };
    query: {
        departmentId: string;
    };
    url: '/api/positions/name/{name}';
};

export type PositionsControllerFindOneByNameInDepartmentErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
};

export type PositionsControllerFindOneByNameInDepartmentResponses = {
    200: PositionEntity;
};

export type PositionsControllerFindOneByNameInDepartmentResponse = PositionsControllerFindOneByNameInDepartmentResponses[keyof PositionsControllerFindOneByNameInDepartmentResponses];

export type SignatureFieldsControllerFindAllData = {
    body?: never;
    path?: never;
    query: {
        limit: number;
    };
    url: '/api/signature-fields';
};

export type SignatureFieldsControllerFindAllErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
};

export type SignatureFieldsControllerFindAllResponses = {
    200: Array<SignatureFieldEntity>;
};

export type SignatureFieldsControllerFindAllResponse = SignatureFieldsControllerFindAllResponses[keyof SignatureFieldsControllerFindAllResponses];

export type SignatureFieldsControllerCreateData = {
    body: CreateSignatureFieldDto;
    path?: never;
    query?: never;
    url: '/api/signature-fields';
};

export type SignatureFieldsControllerCreateErrors = {
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type SignatureFieldsControllerCreateResponses = {
    201: SignatureFieldEntity;
};

export type SignatureFieldsControllerCreateResponse = SignatureFieldsControllerCreateResponses[keyof SignatureFieldsControllerCreateResponses];

export type SignatureFieldsControllerRemoveData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/signature-fields/{id}';
};

export type SignatureFieldsControllerRemoveErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
};

export type SignatureFieldsControllerRemoveResponses = {
    200: unknown;
};

export type SignatureFieldsControllerFindOneData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/signature-fields/{id}';
};

export type SignatureFieldsControllerFindOneErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
};

export type SignatureFieldsControllerFindOneResponses = {
    200: SignatureFieldEntity;
};

export type SignatureFieldsControllerFindOneResponse = SignatureFieldsControllerFindOneResponses[keyof SignatureFieldsControllerFindOneResponses];

export type SignatureFieldsControllerUpdateData = {
    body: UpdateSignatureFieldDto;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/signature-fields/{id}';
};

export type SignatureFieldsControllerUpdateErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type SignatureFieldsControllerUpdateResponses = {
    200: SignatureFieldEntity;
};

export type SignatureFieldsControllerUpdateResponse = SignatureFieldsControllerUpdateResponses[keyof SignatureFieldsControllerUpdateResponses];

export type SignaturesControllerUpdateSignatureSignerData = {
    body: UpdateSignatureSignerDto;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/signatures/{id}/signer';
};

export type SignaturesControllerUpdateSignatureSignerResponses = {
    200: {
        [key: string]: unknown;
    };
};

export type SignaturesControllerUpdateSignatureSignerResponse = SignaturesControllerUpdateSignatureSignerResponses[keyof SignaturesControllerUpdateSignatureSignerResponses];

export type DepartmentsControllerFindAllData = {
    body?: never;
    path?: never;
    query: {
        limit: number;
    };
    url: '/api/departments';
};

export type DepartmentsControllerFindAllErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
};

export type DepartmentsControllerFindAllResponses = {
    200: Array<DepartmentEntity>;
};

export type DepartmentsControllerFindAllResponse = DepartmentsControllerFindAllResponses[keyof DepartmentsControllerFindAllResponses];

export type DepartmentsControllerCreateData = {
    body: CreateDepartmentDto;
    path?: never;
    query?: never;
    url: '/api/departments';
};

export type DepartmentsControllerCreateErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type DepartmentsControllerCreateResponses = {
    201: DepartmentEntity;
};

export type DepartmentsControllerCreateResponse = DepartmentsControllerCreateResponses[keyof DepartmentsControllerCreateResponses];

export type DepartmentsControllerRemoveData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/departments/{id}';
};

export type DepartmentsControllerRemoveErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
};

export type DepartmentsControllerRemoveResponses = {
    200: unknown;
};

export type DepartmentsControllerFindOneData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/departments/{id}';
};

export type DepartmentsControllerFindOneErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
};

export type DepartmentsControllerFindOneResponses = {
    200: DepartmentEntity;
};

export type DepartmentsControllerFindOneResponse = DepartmentsControllerFindOneResponses[keyof DepartmentsControllerFindOneResponses];

export type DepartmentsControllerUpdateData = {
    body: UpdateDepartmentDto;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/departments/{id}';
};

export type DepartmentsControllerUpdateErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type DepartmentsControllerUpdateResponses = {
    200: DepartmentEntity;
};

export type DepartmentsControllerUpdateResponse = DepartmentsControllerUpdateResponses[keyof DepartmentsControllerUpdateResponses];

export type DepartmentsControllerFindOneByNameData = {
    body?: never;
    path: {
        name: string;
    };
    query?: never;
    url: '/api/departments/name/{name}';
};

export type DepartmentsControllerFindOneByNameErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
};

export type DepartmentsControllerFindOneByNameResponses = {
    200: DepartmentEntity;
};

export type DepartmentsControllerFindOneByNameResponse = DepartmentsControllerFindOneByNameResponses[keyof DepartmentsControllerFindOneByNameResponses];

export type FormInstancesControllerFindAllData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Limit on number of positions to return
         */
        limit?: number;
    };
    url: '/api/form-instances';
};

export type FormInstancesControllerFindAllErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
};

export type FormInstancesControllerFindAllResponses = {
    200: Array<FormInstanceEntity>;
};

export type FormInstancesControllerFindAllResponse = FormInstancesControllerFindAllResponses[keyof FormInstancesControllerFindAllResponses];

export type FormInstancesControllerCreateData = {
    body: CreateFormInstanceDto;
    path?: never;
    query?: never;
    url: '/api/form-instances';
};

export type FormInstancesControllerCreateErrors = {
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type FormInstancesControllerCreateResponses = {
    201: FormInstanceEntity;
};

export type FormInstancesControllerCreateResponse = FormInstancesControllerCreateResponses[keyof FormInstancesControllerCreateResponses];

export type FormInstancesControllerFindAllAssignedToCurrentEmployeeData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/form-instances/me';
};

export type FormInstancesControllerFindAllAssignedToCurrentEmployeeErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
};

export type FormInstancesControllerFindAllAssignedToCurrentEmployeeResponses = {
    200: Array<FormInstanceEntity>;
};

export type FormInstancesControllerFindAllAssignedToCurrentEmployeeResponse = FormInstancesControllerFindAllAssignedToCurrentEmployeeResponses[keyof FormInstancesControllerFindAllAssignedToCurrentEmployeeResponses];

export type FormInstancesControllerFindAllCreatedByCurrentEmployeeData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/form-instances/created/me';
};

export type FormInstancesControllerFindAllCreatedByCurrentEmployeeErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
};

export type FormInstancesControllerFindAllCreatedByCurrentEmployeeResponses = {
    200: Array<FormInstanceEntity>;
};

export type FormInstancesControllerFindAllCreatedByCurrentEmployeeResponse = FormInstancesControllerFindAllCreatedByCurrentEmployeeResponses[keyof FormInstancesControllerFindAllCreatedByCurrentEmployeeResponses];

export type FormInstancesControllerRemoveData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/form-instances/{id}';
};

export type FormInstancesControllerRemoveErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
};

export type FormInstancesControllerRemoveResponses = {
    200: unknown;
};

export type FormInstancesControllerFindOneData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/form-instances/{id}';
};

export type FormInstancesControllerFindOneErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
};

export type FormInstancesControllerFindOneResponses = {
    200: FormInstanceEntity;
};

export type FormInstancesControllerFindOneResponse = FormInstancesControllerFindOneResponses[keyof FormInstancesControllerFindOneResponses];

export type FormInstancesControllerUpdateData = {
    body: UpdateFormInstanceDto;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/form-instances/{id}';
};

export type FormInstancesControllerUpdateErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type FormInstancesControllerUpdateResponses = {
    200: FormInstanceEntity;
};

export type FormInstancesControllerUpdateResponse = FormInstancesControllerUpdateResponses[keyof FormInstancesControllerUpdateResponses];

export type FormInstancesControllerSignFormInstanceData = {
    body?: never;
    path: {
        formInstanceId: string;
        signatureId: string;
    };
    query?: never;
    url: '/api/form-instances/{formInstanceId}/sign/{signatureId}';
};

export type FormInstancesControllerSignFormInstanceErrors = {
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type FormInstancesControllerSignFormInstanceResponses = {
    200: FormInstanceEntity;
};

export type FormInstancesControllerSignFormInstanceResponse = FormInstancesControllerSignFormInstanceResponses[keyof FormInstancesControllerSignFormInstanceResponses];

export type FormInstancesControllerCompleteFormInstanceData = {
    body?: never;
    path: {
        formInstanceId: string;
    };
    query?: never;
    url: '/api/form-instances/{formInstanceId}/complete';
};

export type FormInstancesControllerCompleteFormInstanceErrors = {
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type FormInstancesControllerCompleteFormInstanceResponses = {
    200: FormInstanceEntity;
};

export type FormInstancesControllerCompleteFormInstanceResponse = FormInstancesControllerCompleteFormInstanceResponses[keyof FormInstancesControllerCompleteFormInstanceResponses];

export type FormTemplatesControllerFindAllData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Limit on number of form templates to return
         */
        limit?: number;
    };
    url: '/api/form-templates';
};

export type FormTemplatesControllerFindAllErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
};

export type FormTemplatesControllerFindAllResponses = {
    200: Array<FormTemplateEntity>;
};

export type FormTemplatesControllerFindAllResponse = FormTemplatesControllerFindAllResponses[keyof FormTemplatesControllerFindAllResponses];

export type FormTemplatesControllerCreateData = {
    body: CreateFormTemplateDto;
    path?: never;
    query?: never;
    url: '/api/form-templates';
};

export type FormTemplatesControllerCreateErrors = {
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type FormTemplatesControllerCreateResponses = {
    201: FormTemplateEntity;
};

export type FormTemplatesControllerCreateResponse = FormTemplatesControllerCreateResponses[keyof FormTemplatesControllerCreateResponses];

export type FormTemplatesControllerRemoveData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/form-templates/{id}';
};

export type FormTemplatesControllerRemoveErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
};

export type FormTemplatesControllerRemoveResponses = {
    200: unknown;
};

export type FormTemplatesControllerFindOneData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/form-templates/{id}';
};

export type FormTemplatesControllerFindOneErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
};

export type FormTemplatesControllerFindOneResponses = {
    200: FormTemplateEntity;
};

export type FormTemplatesControllerFindOneResponse = FormTemplatesControllerFindOneResponses[keyof FormTemplatesControllerFindOneResponses];

export type FormTemplatesControllerUpdateData = {
    body: UpdateFormTemplateDto;
    path: {
        id: string;
    };
    query?: never;
    url: '/api/form-templates/{id}';
};

export type FormTemplatesControllerUpdateErrors = {
    /**
     * Bad Request
     */
    400: unknown;
    /**
     * Unauthorized Request
     */
    403: unknown;
    /**
     * Resource not found
     */
    404: unknown;
    /**
     * Bad Request
     */
    422: unknown;
};

export type FormTemplatesControllerUpdateResponses = {
    200: FormTemplateEntity;
};

export type FormTemplatesControllerUpdateResponse = FormTemplatesControllerUpdateResponses[keyof FormTemplatesControllerUpdateResponses];

export type ClientOptions = {
    baseUrl: string;
};