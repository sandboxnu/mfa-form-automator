import { EmployeeScope } from '@prisma/client';

/* eslint-disable */
export default async () => {
  const t = {
    ['./departments/entities/department.entity']: await import(
      './departments/entities/department.entity'
    ),
    ['./employees/entities/employee.entity']: await import(
      './employees/entities/employee.entity'
    ),
    ['./positions/entities/position.entity']: await import(
      './positions/entities/position.entity'
    ),
    ['./signatures/dto/create-signature.dto']: await import(
      './signatures/dto/create-signature.dto'
    ),
    ['./signature-fields/dto/create-signature-field.dto']: await import(
      './signature-fields/dto/create-signature-field.dto'
    ),
    ['./signature-fields/entities/signature-field.entity']: await import(
      './signature-fields/entities/signature-field.entity'
    ),
    ['./form-instances/entities/form-instance.entity']: await import(
      './form-instances/entities/form-instance.entity'
    ),
    ['./form-templates/entities/form-template.entity']: await import(
      './form-templates/entities/form-template.entity'
    ),
    ['./signatures/entities/signature.entity']: await import(
      './signatures/entities/signature.entity'
    ),
  };
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('./auth/entities/jwt.entity'),
          {
            JwtEntity: { access_token: { required: true, type: () => String } },
          },
        ],
        [
          import('./departments/entities/department.entity'),
          {
            DepartmentEntity: {
              id: { required: true, type: () => String },
              name: { required: true, type: () => String },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
            },
          },
        ],
        [
          import('./positions/entities/position.entity'),
          {
            PositionBaseEntity: {
              id: { required: true, type: () => String },
              name: { required: true, type: () => String },
              single: { required: true, type: () => Boolean },
              departmentId: { required: true, type: () => String },
              department: {
                required: true,
                type: () =>
                  t['./departments/entities/department.entity']
                    .DepartmentEntity,
              },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
            },
            PositionEntity: {
              employees: {
                required: true,
                type: () => [
                  t['./employees/entities/employee.entity'].EmployeeBaseEntity,
                ],
              },
            },
          },
        ],
        [
          import('./employees/entities/employee.entity'),
          {
            EmployeeBaseEntity: {
              id: { required: true, type: () => String },
              firstName: { required: true, type: () => String },
              lastName: { required: true, type: () => String },
              positionId: { required: true, type: () => String },
              email: { required: true, type: () => String },
              pswdHash: { required: true, type: () => String, nullable: true },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
            },
            EmployeeEntity: {
              position: {
                required: true,
                type: () =>
                  t['./positions/entities/position.entity'].PositionBaseEntity,
              },
            },
          },
        ],
        [
          import('./employees/dto/create-employee.dto'),
          {
            CreateEmployeeDto: {
              firstName: { required: true, type: () => String },
              lastName: { required: true, type: () => String },
              positionId: { required: true, type: () => String },
              email: { required: true, type: () => String },
              password: { required: true, type: () => String, minLength: 5 },
              scope: { required: true, type: () => EmployeeScope },
            },
          },
        ],
        [
          import('./employees/dto/update-employee.dto'),
          { UpdateEmployeeDto: {} },
        ],
        [
          import('./auth/entities/user.entity'),
          {
            UserEntity: {
              id: { required: true, type: () => String },
              email: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./positions/dto/create-position.dto'),
          {
            CreatePositionDto: {
              name: { required: true, type: () => String },
              departmentId: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./positions/dto/update-position.dto'),
          { UpdatePositionDto: {} },
        ],
        [
          import('./signature-fields/dto/create-signature-field.dto'),
          {
            CreateSignatureFieldDto: {
              name: { required: true, type: () => String },
              order: { required: true, type: () => Number },
              signerPositionId: { required: false, type: () => String },
              formTemplateId: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./signature-fields/dto/update-signature-field.dto'),
          { UpdateSignatureFieldDto: {} },
        ],
        [
          import('./signature-fields/entities/signature-field.entity'),
          {
            SignatureFieldEntity: {
              id: { required: true, type: () => String },
              name: { required: true, type: () => String },
              order: { required: true, type: () => Number },
              signerPositionId: {
                required: true,
                type: () => String,
                nullable: true,
              },
              signerPosition: {
                required: true,
                type: () =>
                  t['./positions/entities/position.entity'].PositionBaseEntity,
                nullable: true,
              },
              formTemplateId: { required: true, type: () => String },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
            },
          },
        ],
        [
          import('./signatures/dto/create-signature.dto'),
          {
            CreateSignatureDto: {
              order: { required: true, type: () => Number },
              signerPositionId: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./form-instances/dto/create-form-instance.dto'),
          {
            CreateFormInstanceDto: {
              name: { required: true, type: () => String },
              signatures: {
                required: true,
                type: () => [
                  t['./signatures/dto/create-signature.dto'].CreateSignatureDto,
                ],
              },
              originatorId: { required: true, type: () => String },
              formTemplateId: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./form-instances/dto/update-form-instance.dto'),
          { UpdateFormInstanceDto: {} },
        ],
        [
          import('./form-templates/dto/create-form-template.dto'),
          {
            CreateFormTemplateDto: {
              name: { required: true, type: () => String },
              formDocLink: { required: true, type: () => String },
              signatureFields: {
                required: true,
                type: () => [
                  t['./signature-fields/dto/create-signature-field.dto']
                    .CreateSignatureFieldDto,
                ],
              },
            },
          },
        ],
        [
          import('./form-templates/dto/update-form-template.dto'),
          { UpdateFormTemplateDto: {} },
        ],
        [
          import('./form-templates/entities/form-template.entity'),
          {
            FormTemplateBaseEntity: {
              id: { required: true, type: () => String },
              name: { required: true, type: () => String },
              formDocLink: { required: true, type: () => String },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
            },
            FormTemplateEntity: {
              signatureFields: {
                required: true,
                type: () => [
                  t['./signature-fields/entities/signature-field.entity']
                    .SignatureFieldEntity,
                ],
              },
              formInstances: {
                required: true,
                type: () => [
                  t['./form-instances/entities/form-instance.entity']
                    .FormInstanceEntity,
                ],
              },
            },
          },
        ],
        [
          import('./signatures/entities/signature.entity'),
          {
            SignatureEntity: {
              id: { required: true, type: () => String },
              order: { required: true, type: () => Number },
              signed: { required: true, type: () => Boolean },
              signedDocLink: {
                required: true,
                type: () => String,
                nullable: true,
              },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
              signerPositionId: { required: true, type: () => String },
              signerPosition: {
                required: true,
                type: () =>
                  t['./positions/entities/position.entity'].PositionBaseEntity,
              },
              userSignedById: {
                required: true,
                type: () => String,
                nullable: true,
              },
              userSignedBy: {
                required: true,
                type: () =>
                  t['./employees/entities/employee.entity'].EmployeeBaseEntity,
                nullable: true,
              },
              formInstanceId: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./form-instances/entities/form-instance.entity'),
          {
            FormInstanceEntity: {
              id: { required: true, type: () => String },
              name: { required: true, type: () => String },
              formDocLink: { required: true, type: () => String },
              completed: { required: true, type: () => Boolean },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
              originatorId: { required: true, type: () => String },
              originator: { required: true },
              formTemplateId: { required: true, type: () => String },
              formTemplate: {
                required: true,
                type: () =>
                  t['./form-templates/entities/form-template.entity']
                    .FormTemplateBaseEntity,
              },
              signatures: {
                required: true,
                type: () => [
                  t['./signatures/entities/signature.entity'].SignatureEntity,
                ],
              },
            },
          },
        ],
        [
          import('./departments/dto/create-department.dto'),
          {
            CreateDepartmentDto: {
              name: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./departments/dto/update-department.dto'),
          { UpdateDepartmentDto: {} },
        ],
        [
          import('./auth/dto/login.dto'),
          {
            LoginDto: {
              email: { required: true, type: () => String },
              pass: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./signatures/dto/update-signature.dto'),
          { UpdateSignatureDto: {} },
        ],
      ],
      controllers: [
        [
          import('./app.controller'),
          {
            AppController: {
              getHello: { type: String },
              login: {},
              logout: {},
            },
          },
        ],
        [
          import('./employees/employees.controller'),
          {
            EmployeesController: {
              create: {
                type: t['./employees/entities/employee.entity'].EmployeeEntity,
              },
              findAll: {
                type: [
                  t['./employees/entities/employee.entity'].EmployeeEntity,
                ],
              },
              findMe: {
                type: t['./employees/entities/employee.entity'].EmployeeEntity,
              },
              findOne: {
                type: t['./employees/entities/employee.entity'].EmployeeEntity,
              },
              update: {
                type: t['./employees/entities/employee.entity'].EmployeeEntity,
              },
              remove: {},
            },
          },
        ],
        [
          import('./positions/positions.controller'),
          {
            PositionsController: {
              create: {
                type: t['./positions/entities/position.entity'].PositionEntity,
              },
              findAll: {
                type: [
                  t['./positions/entities/position.entity'].PositionEntity,
                ],
              },
              findOne: {
                type: t['./positions/entities/position.entity'].PositionEntity,
              },
              update: {
                type: t['./positions/entities/position.entity'].PositionEntity,
              },
              remove: {},
            },
          },
        ],
        [
          import('./signature-fields/signature-fields.controller'),
          {
            SignatureFieldsController: {
              create: {
                type: t['./signature-fields/entities/signature-field.entity']
                  .SignatureFieldEntity,
              },
              findAll: {
                type: [
                  t['./signature-fields/entities/signature-field.entity']
                    .SignatureFieldEntity,
                ],
              },
              findOne: {
                type: t['./signature-fields/entities/signature-field.entity']
                  .SignatureFieldEntity,
              },
              update: {
                type: t['./signature-fields/entities/signature-field.entity']
                  .SignatureFieldEntity,
              },
              remove: {},
            },
          },
        ],
        [
          import('./form-instances/form-instances.controller'),
          {
            FormInstancesController: {
              create: {
                type: t['./form-instances/entities/form-instance.entity']
                  .FormInstanceEntity,
              },
              findAll: {
                type: [
                  t['./form-instances/entities/form-instance.entity']
                    .FormInstanceEntity,
                ],
              },
              findAllAssignedToCurrentEmployee: {
                type: [
                  t['./form-instances/entities/form-instance.entity']
                    .FormInstanceEntity,
                ],
              },
              findAllCreatedByCurrentEmployee: {
                type: [
                  t['./form-instances/entities/form-instance.entity']
                    .FormInstanceEntity,
                ],
              },
              findOne: {
                type: t['./form-instances/entities/form-instance.entity']
                  .FormInstanceEntity,
              },
              update: {
                type: t['./form-instances/entities/form-instance.entity']
                  .FormInstanceEntity,
              },
              remove: {},
              signFormInstance: { type: Object },
            },
          },
        ],
        [
          import('./form-templates/form-templates.controller'),
          {
            FormTemplatesController: {
              create: {
                type: t['./form-templates/entities/form-template.entity']
                  .FormTemplateEntity,
              },
              findAll: {
                type: [
                  t['./form-templates/entities/form-template.entity']
                    .FormTemplateEntity,
                ],
              },
              findOne: {
                type: t['./form-templates/entities/form-template.entity']
                  .FormTemplateEntity,
              },
              update: {
                type: t['./form-templates/entities/form-template.entity']
                  .FormTemplateEntity,
              },
              remove: {},
            },
          },
        ],
        [
          import('./departments/departments.controller'),
          {
            DepartmentsController: {
              create: {
                type: t['./departments/entities/department.entity']
                  .DepartmentEntity,
              },
              findAll: {
                type: [
                  t['./departments/entities/department.entity']
                    .DepartmentEntity,
                ],
              },
              findOne: {
                type: t['./departments/entities/department.entity']
                  .DepartmentEntity,
              },
              update: {
                type: t['./departments/entities/department.entity']
                  .DepartmentEntity,
              },
              remove: {},
            },
          },
        ],
      ],
    },
  };
};
