// This file is auto-generated by @hey-api/openapi-ts

export type JwtEntity = {
  accessToken: string;
};

export type RegisterEmployeeDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type DepartmentEntity = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type PositionBaseEntity = {
  id: string;
  name: string;
  single: boolean;
  department: DepartmentEntity;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
};

export enum Scope {
  BASE_USER = 'BASE_USER',
  ADMIN = 'ADMIN',
}

export type EmployeeEntity = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  signatureLink: string | null;
  scope: 'BASE_USER' | 'ADMIN';
  position: PositionBaseEntity | null;
  positionId: string | null;
  pswdHash: string | null;
  createdAt: string;
  updatedAt: string;
  refreshToken: string | null;
};

export type CreateEmployeeDto = {
  firstName: string;
  lastName: string;
  positionId?: string;
  email: string;
  password: string;
  scope: 'BASE_USER' | 'ADMIN';
};

export type OnboardEmployeeDto = {
  signatureLink: string;
  positionId: string;
};

export type UpdateEmployeeDto = {
  firstName?: string;
  lastName?: string;
  positionId?: string;
  scope?: 'BASE_USER' | 'ADMIN';
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
  signatureLink: string | null;
  scope: 'BASE_USER' | 'ADMIN';
  positionId: string | null;
  pswdHash: string | null;
  createdAt: string;
  updatedAt: string;
  refreshToken: string | null;
};

export type PositionEntity = {
  id: string;
  name: string;
  single: boolean;
  department: DepartmentEntity;
  employees: Array<EmployeeBaseEntity>;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdatePositionDto = {
  name?: string;
  departmentId?: string;
};

export type ConnectEmployeeDto = {
  id: string;
};

export enum SignerType {
  POSITION = 'POSITION',
  DEPARTMENT = 'DEPARTMENT',
  USER = 'USER',
  USER_LIST = 'USER_LIST',
}

export type UpdateAssignedGroupSignerDto = {
  fieldGroupId?: string;
  signerType?: 'POSITION' | 'DEPARTMENT' | 'USER' | 'USER_LIST';
  signerEmployeeId?: string;
  signerPositionId?: string;
  signerDepartmentId?: string;
  signerEmployeeList?: Array<ConnectEmployeeDto>;
};

export enum Type {
  SIGNATURE = 'SIGNATURE',
  CHECKBOX = 'CHECKBOX',
  TEXT_FIELD = 'TEXT_FIELD',
}

export type CreateTemplateBoxDto = {
  type: 'SIGNATURE' | 'CHECKBOX' | 'TEXT_FIELD';
  x_coordinate: number;
  y_coordinate: number;
};

export type CreateFieldGroupDto = {
  name: string;
  order: number;
  templateBoxes: Array<CreateTemplateBoxDto>;
};

export type CreateFormTemplateDto = {
  file: Blob | File;
  name: string;
  description: string;
  fieldGroups: Array<CreateFieldGroupDto>;
};

export type TemplateBoxBaseEntity = {
  id: string;
  type: 'SIGNATURE' | 'CHECKBOX' | 'TEXT_FIELD';
  x_coordinate: number;
  y_coordinate: number;
  createdAt: string;
  updatedAt: string;
  fieldGroupId: string;
};

export type FieldGroupBaseEntity = {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  formTemplateId: string;
  templateBoxes: Array<TemplateBoxBaseEntity>;
};

export type FormTemplateBaseEntity = {
  id: string;
  name: string;
  formDocLink: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AssignedGroupEntity = {
  id: string;
  fieldGroupId: string;
  order: number;
  signed: boolean;
  signedDocLink: string | null;
  createdAt: string;
  updatedAt: string;
  signerPositionId: string | null;
  signerDepartmentId: string | null;
  signerEmployeeId: string | null;
  signingEmployeeId: string | null;
  signerType: 'POSITION' | 'DEPARTMENT' | 'USER' | 'USER_LIST';
  formInstanceId: string;
  fieldGroup: FieldGroupBaseEntity;
  signingEmployee: EmployeeBaseEntity | null;
  signerPosition: PositionBaseEntity | null;
  signerDepartment: DepartmentEntity | null;
  signerEmployee: EmployeeBaseEntity | null;
  signerEmployeeList: Array<EmployeeBaseEntity> | null;
};

export type FormInstanceEntity = {
  id: string;
  name: string;
  description: string | null;
  formDocLink: string;
  completed: boolean;
  markedCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  markedCompletedAt?: string | null;
  originator: EmployeeEntity;
  formTemplate: FormTemplateBaseEntity;
  assignedGroups: Array<AssignedGroupEntity>;
  originatorId: string;
  formTemplateId: string;
};

export type FormTemplateEntity = {
  id: string;
  name: string;
  formDocLink: string;
  description: string | null;
  fieldGroups: Array<FieldGroupBaseEntity>;
  formInstances: Array<FormInstanceEntity>;
  createdAt: string;
  updatedAt: string;
};

export type UpdateFormTemplateDto = {
  file?: Blob | File;
  name?: string;
  description?: string;
};

export type CreateDepartmentDto = {
  name: string;
};

export type UpdateDepartmentDto = {
  name?: string;
};

export type CreateAssignedGroupDto = {
  order: number;
  fieldGroupId: string;
  signerType: 'POSITION' | 'DEPARTMENT' | 'USER' | 'USER_LIST';
  signerEmployeeId?: string;
  signerPositionId?: string;
  signerDepartmentId?: string;
  signerEmployeeList: Array<ConnectEmployeeDto>;
};

export type CreateFormInstanceDto = {
  name: string;
  description: string;
  assignedGroups: Array<CreateAssignedGroupDto>;
  originatorId: string;
  formTemplateId: string;
  formDocLink: string;
};

export type UpdateFormInstanceDto = {
  name?: string;
  description?: string;
  formDocLink?: string;
};

export type SignFormInstanceDto = {
  file: Blob | File;
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

export type AppControllerGetHelloResponse =
  AppControllerGetHelloResponses[keyof AppControllerGetHelloResponses];

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

export type AppControllerLoginResponse =
  AppControllerLoginResponses[keyof AppControllerLoginResponses];

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

export type AppControllerRefreshResponse =
  AppControllerRefreshResponses[keyof AppControllerRefreshResponses];

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

export type AppControllerRegisterResponse =
  AppControllerRegisterResponses[keyof AppControllerRegisterResponses];

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

export type EmployeesControllerFindAllResponse =
  EmployeesControllerFindAllResponses[keyof EmployeesControllerFindAllResponses];

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

export type EmployeesControllerCreateResponse =
  EmployeesControllerCreateResponses[keyof EmployeesControllerCreateResponses];

export type EmployeesControllerOnboardEmployeeData = {
  body: OnboardEmployeeDto;
  path?: never;
  query?: never;
  url: '/api/employees/onboarding';
};

export type EmployeesControllerOnboardEmployeeErrors = {
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

export type EmployeesControllerOnboardEmployeeResponses = {
  200: EmployeeEntity;
  201: EmployeeEntity;
};

export type EmployeesControllerOnboardEmployeeResponse =
  EmployeesControllerOnboardEmployeeResponses[keyof EmployeesControllerOnboardEmployeeResponses];

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

export type EmployeesControllerFindMeResponse =
  EmployeesControllerFindMeResponses[keyof EmployeesControllerFindMeResponses];

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

export type EmployeesControllerFindOneResponse =
  EmployeesControllerFindOneResponses[keyof EmployeesControllerFindOneResponses];

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

export type EmployeesControllerUpdateResponse =
  EmployeesControllerUpdateResponses[keyof EmployeesControllerUpdateResponses];

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

export type PositionsControllerFindAllResponse =
  PositionsControllerFindAllResponses[keyof PositionsControllerFindAllResponses];

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

export type PositionsControllerCreateResponse =
  PositionsControllerCreateResponses[keyof PositionsControllerCreateResponses];

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

export type PositionsControllerFindAllInDepartmentResponse =
  PositionsControllerFindAllInDepartmentResponses[keyof PositionsControllerFindAllInDepartmentResponses];

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

export type PositionsControllerFindAllInDepartmentNameResponse =
  PositionsControllerFindAllInDepartmentNameResponses[keyof PositionsControllerFindAllInDepartmentNameResponses];

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

export type PositionsControllerFindOneResponse =
  PositionsControllerFindOneResponses[keyof PositionsControllerFindOneResponses];

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

export type PositionsControllerUpdateResponse =
  PositionsControllerUpdateResponses[keyof PositionsControllerUpdateResponses];

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

export type PositionsControllerFindOneByNameInDepartmentResponse =
  PositionsControllerFindOneByNameInDepartmentResponses[keyof PositionsControllerFindOneByNameInDepartmentResponses];

export type AssignedGroupControllerUpdateAssignedGroupSignerData = {
  body: UpdateAssignedGroupSignerDto;
  path: {
    id: string;
  };
  query?: never;
  url: '/api/signatures/{id}/signer';
};

export type AssignedGroupControllerUpdateAssignedGroupSignerResponses = {
  200: {
    [key: string]: unknown;
  };
};

export type AssignedGroupControllerUpdateAssignedGroupSignerResponse =
  AssignedGroupControllerUpdateAssignedGroupSignerResponses[keyof AssignedGroupControllerUpdateAssignedGroupSignerResponses];

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

export type FormTemplatesControllerFindAllResponse =
  FormTemplatesControllerFindAllResponses[keyof FormTemplatesControllerFindAllResponses];

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

export type FormTemplatesControllerCreateResponse =
  FormTemplatesControllerCreateResponses[keyof FormTemplatesControllerCreateResponses];

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

export type FormTemplatesControllerFindOneResponse =
  FormTemplatesControllerFindOneResponses[keyof FormTemplatesControllerFindOneResponses];

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

export type FormTemplatesControllerUpdateResponse =
  FormTemplatesControllerUpdateResponses[keyof FormTemplatesControllerUpdateResponses];

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

export type DepartmentsControllerFindAllResponse =
  DepartmentsControllerFindAllResponses[keyof DepartmentsControllerFindAllResponses];

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

export type DepartmentsControllerCreateResponse =
  DepartmentsControllerCreateResponses[keyof DepartmentsControllerCreateResponses];

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

export type DepartmentsControllerFindOneResponse =
  DepartmentsControllerFindOneResponses[keyof DepartmentsControllerFindOneResponses];

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

export type DepartmentsControllerUpdateResponse =
  DepartmentsControllerUpdateResponses[keyof DepartmentsControllerUpdateResponses];

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

export type DepartmentsControllerFindOneByNameResponse =
  DepartmentsControllerFindOneByNameResponses[keyof DepartmentsControllerFindOneByNameResponses];

export type FormInstancesControllerFindAllData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Limit on number of form instances to return
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

export type FormInstancesControllerFindAllResponse =
  FormInstancesControllerFindAllResponses[keyof FormInstancesControllerFindAllResponses];

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

export type FormInstancesControllerCreateResponse =
  FormInstancesControllerCreateResponses[keyof FormInstancesControllerCreateResponses];

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

export type FormInstancesControllerFindAllAssignedToCurrentEmployeeResponse =
  FormInstancesControllerFindAllAssignedToCurrentEmployeeResponses[keyof FormInstancesControllerFindAllAssignedToCurrentEmployeeResponses];

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

export type FormInstancesControllerFindAllCreatedByCurrentEmployeeResponse =
  FormInstancesControllerFindAllCreatedByCurrentEmployeeResponses[keyof FormInstancesControllerFindAllCreatedByCurrentEmployeeResponses];

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

export type FormInstancesControllerFindOneResponse =
  FormInstancesControllerFindOneResponses[keyof FormInstancesControllerFindOneResponses];

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

export type FormInstancesControllerUpdateResponse =
  FormInstancesControllerUpdateResponses[keyof FormInstancesControllerUpdateResponses];

export type FormInstancesControllerSignFormInstanceData = {
  body: SignFormInstanceDto;
  path: {
    formInstanceId: string;
    assignedGroupId: string;
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

export type FormInstancesControllerSignFormInstanceResponse =
  FormInstancesControllerSignFormInstanceResponses[keyof FormInstancesControllerSignFormInstanceResponses];

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

export type FormInstancesControllerCompleteFormInstanceResponse =
  FormInstancesControllerCompleteFormInstanceResponses[keyof FormInstancesControllerCompleteFormInstanceResponses];

export type ClientOptions = {
  baseURL: string;
};
