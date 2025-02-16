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
    scope: {
      type: 'string',
      enum: ['BASE_USER', 'ADMIN'],
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
    'scope',
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
    signatureLink: {
      type: 'string',
    },
    scope: {
      type: 'string',
      enum: ['BASE_USER', 'ADMIN'],
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
    'signatureLink',
    'scope',
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
    scope: {
      type: 'string',
      enum: ['BASE_USER', 'ADMIN'],
    },
  },
  required: [
    'firstName',
    'lastName',
    'positionId',
    'email',
    'password',
    'signatureLink',
    'scope',
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
    scope: {
      type: 'string',
      enum: ['BASE_USER', 'ADMIN'],
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
    signatureLink: {
      type: 'string',
    },
    scope: {
      type: 'string',
      enum: ['BASE_USER', 'ADMIN'],
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
    'signatureLink',
    'scope',
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
    employees: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/EmployeeBaseEntity',
      },
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
    'employees',
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

export const ConnectEmployeeDtoSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
  },
  required: ['id'],
} as const;

export const UpdateAssignedGroupSignerDtoSchema = {
  type: 'object',
  properties: {
    fieldGroupId: {
      type: 'string',
    },
    signerType: {
      type: 'string',
      enum: ['POSITION', 'DEPARTMENT', 'USER', 'USER_LIST'],
    },
    signerEmployeeId: {
      type: 'string',
    },
    signerPositionId: {
      type: 'string',
    },
    signerDepartmentId: {
      type: 'string',
    },
    signerEmployeeList: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/ConnectEmployeeDto',
      },
    },
  },
} as const;

export const CreateTemplateBoxDtoSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    type: {
      type: 'string',
      enum: ['signature', 'checkbox'],
    },
    x_coordinate: {
      type: 'number',
    },
    y_coordinate: {
      type: 'number',
    },
    fieldGroupId: {
      type: 'string',
    },
  },
  required: ['name', 'type', 'x_coordinate', 'y_coordinate', 'fieldGroupId'],
} as const;

export const CreateFieldGroupDtoSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    order: {
      type: 'number',
    },
    templateBoxes: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/CreateTemplateBoxDto',
      },
    },
  },
  required: ['name', 'order', 'templateBoxes'],
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
    description: {
      type: 'string',
    },
    fieldGroups: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/CreateFieldGroupDto',
      },
    },
  },
  required: ['name', 'formDocLink', 'fieldGroups'],
} as const;

export const TemplateBoxBaseEntitySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    type: {
      type: 'string',
      enum: ['SIGNATURE', 'CHECKBOX', 'TEXT_FIELD'],
    },
    x_coordinate: {
      type: 'number',
    },
    y_coordinate: {
      type: 'number',
    },
    createdAt: {
      format: 'date-time',
      type: 'string',
    },
    updatedAt: {
      format: 'date-time',
      type: 'string',
    },
    fieldGroupId: {
      type: 'string',
    },
  },
  required: [
    'id',
    'type',
    'x_coordinate',
    'y_coordinate',
    'createdAt',
    'updatedAt',
    'fieldGroupId',
  ],
} as const;

export const FieldGroupBaseEntitySchema = {
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
    createdAt: {
      format: 'date-time',
      type: 'string',
    },
    updatedAt: {
      format: 'date-time',
      type: 'string',
    },
    formTemplateId: {
      type: 'string',
    },
    templateBoxes: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/TemplateBoxBaseEntity',
      },
    },
  },
  required: [
    'id',
    'name',
    'order',
    'createdAt',
    'updatedAt',
    'formTemplateId',
    'templateBoxes',
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
    description: {
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

export const AssignedGroupEntitySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    fieldGroupId: {
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
    signerDepartmentId: {
      type: 'string',
      nullable: true,
    },
    signerEmployeeId: {
      type: 'string',
      nullable: true,
    },
    signingEmployeeId: {
      type: 'string',
      nullable: true,
    },
    signerType: {
      type: 'string',
      enum: ['POSITION', 'DEPARTMENT', 'USER', 'USER_LIST'],
    },
    formInstanceId: {
      type: 'string',
    },
    fieldGroup: {
      $ref: '#/components/schemas/FieldGroupBaseEntity',
    },
    signingEmployee: {
      nullable: true,
      allOf: [
        {
          $ref: '#/components/schemas/EmployeeBaseEntity',
        },
      ],
    },
    signerPosition: {
      nullable: true,
      allOf: [
        {
          $ref: '#/components/schemas/PositionBaseEntity',
        },
      ],
    },
    signerDepartment: {
      nullable: true,
      allOf: [
        {
          $ref: '#/components/schemas/DepartmentEntity',
        },
      ],
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
      nullable: true,
      type: 'array',
      items: {
        $ref: '#/components/schemas/EmployeeBaseEntity',
      },
    },
  },
  required: [
    'id',
    'fieldGroupId',
    'order',
    'signed',
    'createdAt',
    'updatedAt',
    'signerType',
    'formInstanceId',
    'fieldGroup',
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
    description: {
      type: 'string',
      nullable: true,
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
    assignedGroups: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/AssignedGroupEntity',
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
    'description',
    'formDocLink',
    'completed',
    'markedCompleted',
    'createdAt',
    'updatedAt',
    'originator',
    'formTemplate',
    'assignedGroups',
    'originatorId',
    'formTemplateId',
  ],
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
    description: {
      type: 'string',
    },
    fieldGroups: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/FieldGroupBaseEntity',
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
    'fieldGroups',
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
    description: {
      type: 'string',
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

export const CreateAssignedGroupDtoSchema = {
  type: 'object',
  properties: {
    order: {
      type: 'number',
    },
    fieldGroupId: {
      type: 'string',
    },
    signerType: {
      type: 'string',
      enum: ['POSITION', 'DEPARTMENT', 'USER', 'USER_LIST'],
    },
    signerEmployeeId: {
      type: 'string',
    },
    signerPositionId: {
      type: 'string',
    },
    signerDepartmentId: {
      type: 'string',
    },
    signerEmployeeList: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/ConnectEmployeeDto',
      },
    },
  },
  required: ['order', 'fieldGroupId', 'signerType', 'signerEmployeeList'],
} as const;

export const CreateFormInstanceDtoSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    assignedGroups: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/CreateAssignedGroupDto',
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
    'assignedGroups',
    'originatorId',
    'formTemplateId',
    'formDocLink',
  ],
} as const;

export const UpdateFormInstanceDtoSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    formDocLink: {
      type: 'string',
    },
  },
} as const;
