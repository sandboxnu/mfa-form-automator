// This file is auto-generated by @hey-api/openapi-ts

export const JwtEntitySchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
    },
  },
  required: ['accessToken'],
} as const;

export const RegisterEmployeeDtoSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 5,
    },
    positionName: {
      type: 'string',
    },
    departmentName: {
      type: 'string',
    },
    signatureLink: {
      type: 'string',
    },
  },
  required: [
    'firstName',
    'lastName',
    'email',
    'password',
    'positionName',
    'departmentName',
    'signatureLink',
  ],
} as const;

export const DepartmentEntitySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    createdAt: {
      format: 'date-time',
      type: 'string',
    },
    updatedAt: {
      format: 'date-time',
      type: 'string',
    },
  },
  required: ['id', 'name', 'createdAt', 'updatedAt'],
} as const;

export const PositionBaseEntitySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    single: {
      type: 'boolean',
    },
    department: {
      $ref: '#/components/schemas/DepartmentEntity',
    },
    departmentId: {
      type: 'string',
    },
    createdAt: {
      format: 'date-time',
      type: 'string',
    },
    updatedAt: {
      format: 'date-time',
      type: 'string',
    },
  },
  required: [
    'id',
    'name',
    'single',
    'department',
    'departmentId',
    'createdAt',
    'updatedAt',
  ],
} as const;

export const EmployeeEntitySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    isAdmin: {
      type: 'boolean',
    },
    signatureLink: {
      type: 'string',
    },
    position: {
      $ref: '#/components/schemas/PositionBaseEntity',
    },
    positionId: {
      type: 'string',
    },
    pswdHash: {
      type: 'string',
      nullable: true,
    },
    createdAt: {
      format: 'date-time',
      type: 'string',
    },
    updatedAt: {
      format: 'date-time',
      type: 'string',
    },
    refreshToken: {
      type: 'string',
      nullable: true,
    },
  },
  required: [
    'id',
    'firstName',
    'lastName',
    'email',
    'isAdmin',
    'signatureLink',
    'position',
    'positionId',
    'pswdHash',
    'createdAt',
    'updatedAt',
    'refreshToken',
  ],
} as const;

export const CreateEmployeeDtoSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    positionId: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 5,
    },
    signatureLink: {
      type: 'string',
    },
  },
  required: [
    'firstName',
    'lastName',
    'positionId',
    'email',
    'password',
    'signatureLink',
  ],
} as const;

export const UpdateEmployeeDtoSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    positionId: {
      type: 'string',
    },
    signatureLink: {
      type: 'string',
    },
  },
} as const;

export const CreatePositionDtoSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    departmentId: {
      type: 'string',
    },
  },
  required: ['name', 'departmentId'],
} as const;

export const EmployeeBaseEntitySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    isAdmin: {
      type: 'boolean',
    },
    signatureLink: {
      type: 'string',
    },
    positionId: {
      type: 'string',
    },
    pswdHash: {
      type: 'string',
      nullable: true,
    },
    createdAt: {
      format: 'date-time',
      type: 'string',
    },
    updatedAt: {
      format: 'date-time',
      type: 'string',
    },
    refreshToken: {
      type: 'string',
      nullable: true,
    },
  },
  required: [
    'id',
    'firstName',
    'lastName',
    'email',
    'isAdmin',
    'signatureLink',
    'positionId',
    'pswdHash',
    'createdAt',
    'updatedAt',
    'refreshToken',
  ],
} as const;

export const PositionEntitySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    single: {
      type: 'boolean',
    },
    department: {
      $ref: '#/components/schemas/DepartmentEntity',
    },
    departmentId: {
      type: 'string',
    },
    createdAt: {
      format: 'date-time',
      type: 'string',
    },
    updatedAt: {
      format: 'date-time',
      type: 'string',
    },
    employees: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/EmployeeBaseEntity',
      },
    },
  },
  required: [
    'id',
    'name',
    'single',
    'department',
    'departmentId',
    'createdAt',
    'updatedAt',
  ],
} as const;

export const UpdatePositionDtoSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    departmentId: {
      type: 'string',
    },
  },
} as const;

export const CreateSignatureFieldDtoSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    order: {
      type: 'number',
    },
    formTemplateId: {
      type: 'string',
    },
  },
  required: ['name', 'order'],
} as const;

export const SignatureFieldEntitySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    order: {
      type: 'number',
    },
    formTemplateId: {
      type: 'string',
    },
    createdAt: {
      format: 'date-time',
      type: 'string',
    },
    updatedAt: {
      format: 'date-time',
      type: 'string',
    },
  },
  required: ['id', 'name', 'order', 'formTemplateId', 'createdAt', 'updatedAt'],
} as const;

export const UpdateSignatureFieldDtoSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    order: {
      type: 'number',
    },
    formTemplateId: {
      type: 'string',
    },
  },
} as const;

export const ConnectEmployeeDtoSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
  },
  required: ['id'],
} as const;

export const UpdateSignatureSignerDtoSchema = {
  type: 'object',
  properties: {
    signerEmployeeId: {
      type: 'string',
      nullable: true,
    },
    signerPositionId: {
      type: 'string',
      nullable: true,
    },
    signerDepartmentId: {
      type: 'string',
      nullable: true,
    },
    signerEmployeeList: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/ConnectEmployeeDto',
      },
    },
    signerType: {
      type: 'string',
      enum: ['POSITION', 'DEPARTMENT', 'USER', 'USER_LIST'],
    },
  },
} as const;

export const CreateDepartmentDtoSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },
  required: ['name'],
} as const;

export const UpdateDepartmentDtoSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },
} as const;

export const CreateSignatureDtoSchema = {
  type: 'object',
  properties: {
    order: {
      type: 'number',
    },
    signerEmployeeId: {
      type: 'string',
      nullable: true,
    },
    signerPositionId: {
      type: 'string',
      nullable: true,
    },
    signerDepartmentId: {
      type: 'string',
      nullable: true,
    },
    signerEmployeeList: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/ConnectEmployeeDto',
      },
    },
    signerType: {
      type: 'string',
      enum: ['POSITION', 'DEPARTMENT', 'USER', 'USER_LIST'],
    },
  },
  required: [
    'order',
    'signerEmployeeId',
    'signerPositionId',
    'signerDepartmentId',
    'signerEmployeeList',
    'signerType',
  ],
} as const;

export const CreateFormInstanceDtoSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    signatures: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/CreateSignatureDto',
      },
    },
    originatorId: {
      type: 'string',
    },
    formTemplateId: {
      type: 'string',
    },
    formDocLink: {
      type: 'string',
    },
  },
  required: [
    'name',
    'signatures',
    'originatorId',
    'formTemplateId',
    'formDocLink',
  ],
} as const;

export const FormTemplateBaseEntitySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    formDocLink: {
      type: 'string',
    },
    createdAt: {
      format: 'date-time',
      type: 'string',
    },
    updatedAt: {
      format: 'date-time',
      type: 'string',
    },
  },
  required: ['id', 'name', 'formDocLink', 'createdAt', 'updatedAt'],
} as const;

export const SignatureEntitySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    order: {
      type: 'number',
    },
    signed: {
      type: 'boolean',
    },
    signedDocLink: {
      type: 'string',
      nullable: true,
    },
    createdAt: {
      format: 'date-time',
      type: 'string',
    },
    updatedAt: {
      format: 'date-time',
      type: 'string',
    },
    signerPositionId: {
      type: 'string',
      nullable: true,
    },
    signerPosition: {
      nullable: true,
      allOf: [
        {
          $ref: '#/components/schemas/PositionBaseEntity',
        },
      ],
    },
    signerDepartmentId: {
      type: 'string',
      nullable: true,
    },
    signerDepartment: {
      nullable: true,
      allOf: [
        {
          $ref: '#/components/schemas/DepartmentEntity',
        },
      ],
    },
    signerEmployeeId: {
      type: 'string',
      nullable: true,
    },
    signerEmployee: {
      nullable: true,
      allOf: [
        {
          $ref: '#/components/schemas/EmployeeBaseEntity',
        },
      ],
    },
    signerEmployeeList: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/EmployeeBaseEntity',
      },
    },
    signingEmployeeId: {
      type: 'string',
      nullable: true,
    },
    signingEmployee: {
      nullable: true,
      allOf: [
        {
          $ref: '#/components/schemas/EmployeeBaseEntity',
        },
      ],
    },
    signerType: {
      type: 'string',
      enum: ['POSITION', 'DEPARTMENT', 'USER', 'USER_LIST'],
    },
    formInstanceId: {
      type: 'string',
    },
  },
  required: [
    'id',
    'order',
    'signed',
    'signedDocLink',
    'createdAt',
    'updatedAt',
    'signerPositionId',
    'signerPosition',
    'signerDepartmentId',
    'signerDepartment',
    'signerEmployeeId',
    'signerEmployee',
    'signerEmployeeList',
    'signingEmployeeId',
    'signingEmployee',
    'signerType',
    'formInstanceId',
  ],
} as const;

export const FormInstanceEntitySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    formDocLink: {
      type: 'string',
    },
    completed: {
      type: 'boolean',
    },
    markedCompleted: {
      type: 'boolean',
    },
    createdAt: {
      format: 'date-time',
      type: 'string',
    },
    updatedAt: {
      format: 'date-time',
      type: 'string',
    },
    completedAt: {
      format: 'date-time',
      type: 'string',
      nullable: true,
    },
    markedCompletedAt: {
      format: 'date-time',
      type: 'string',
      nullable: true,
    },
    originator: {
      $ref: '#/components/schemas/EmployeeEntity',
    },
    formTemplate: {
      $ref: '#/components/schemas/FormTemplateBaseEntity',
    },
    signatures: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/SignatureEntity',
      },
    },
    originatorId: {
      type: 'string',
    },
    formTemplateId: {
      type: 'string',
    },
  },
  required: [
    'id',
    'name',
    'formDocLink',
    'completed',
    'markedCompleted',
    'createdAt',
    'updatedAt',
    'originator',
    'formTemplate',
    'signatures',
    'originatorId',
    'formTemplateId',
  ],
} as const;

export const UpdateFormInstanceDtoSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    formDocLink: {
      type: 'string',
    },
  },
} as const;

export const CreateFormTemplateDtoSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    formDocLink: {
      type: 'string',
    },
    signatureFields: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/CreateSignatureFieldDto',
      },
    },
  },
  required: ['name', 'formDocLink', 'signatureFields'],
} as const;

export const FormTemplateEntitySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    formDocLink: {
      type: 'string',
    },
    signatureFields: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/SignatureFieldEntity',
      },
    },
    formInstances: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/FormInstanceEntity',
      },
    },
    createdAt: {
      format: 'date-time',
      type: 'string',
    },
    updatedAt: {
      format: 'date-time',
      type: 'string',
    },
  },
  required: [
    'id',
    'name',
    'formDocLink',
    'signatureFields',
    'formInstances',
    'createdAt',
    'updatedAt',
  ],
} as const;

export const UpdateFormTemplateDtoSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    formDocLink: {
      type: 'string',
    },
  },
} as const;
