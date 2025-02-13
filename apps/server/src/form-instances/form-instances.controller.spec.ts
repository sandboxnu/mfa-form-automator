import { Test, TestingModule } from '@nestjs/testing';
import { FormInstancesController } from './form-instances.controller';
import { FormInstancesService } from './form-instances.service';
import { PrismaService } from '../prisma/prisma.service';
import { FormTemplatesService } from '../form-templates/form-templates.service';
// import { FormInstanceEntity } from './entities/form-instance.entity';
// import { EmployeeEntity } from '../employees/entities/employee.entity';
// import { PositionBaseEntity } from '../positions/entities/position.entity';
// import { FormTemplateEntity } from '../form-templates/entities/form-template.entity';
// import { SignatureEntity } from '../signatures/entities/signature.entity';
// import { DepartmentEntity } from '../departments/entities/department.entity';
// import { NotFoundException } from '@nestjs/common';
// import { Prisma } from '@prisma/client';
import { PositionsService } from '../positions/positions.service';
import { LoggerServiceImpl } from '../logger/logger.service';
import { PostmarkService } from '../postmark/postmark.service';
import { EmployeesService } from '../employees/employees.service';
import { DepartmentsService } from '../departments/departments.service';

describe('FormInstancesController', () => {
  let controller: FormInstancesController;
  // let formInstancesService: FormInstancesService;
  // let formTemplatesService: FormTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormInstancesController],
      providers: [
        FormInstancesService,
        FormTemplatesService,
        PositionsService,
        PrismaService,
        EmployeesService,
        LoggerServiceImpl,
        PostmarkService,
        DepartmentsService,
      ],
    }).compile();

    controller = module.get<FormInstancesController>(FormInstancesController);
    // formInstancesService =
    //   module.get<FormInstancesService>(FormInstancesService);
    // formTemplatesService =
    //   module.get<FormTemplatesService>(FormTemplatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

//   describe('create', () => {
//     it('should create a new form instance', async () => {
//       const createFormInstanceDto = {
//         name: 'Form Instance 1',
//         signatures: [
//           {
//             order: 0,
//             signerPositionId: 'signerId',
//             assignedUserId: 'assignedUserId',
//           },
//         ],
//         originatorId: 'originatorId',
//         formTemplateId: 'formTemplateId',
//       };

//       const formTemplateResult = {
//         id: 'c0f1fdee-278c-4977-86a2-89ae6a73ffb4',
//         name: 'Form Template 1',
//         formDocLink: 'mfa.org/formtemplate1',
//         signatureFields: [
//           {
//             id: '086885ca-ecc8-4614-8103-9a99fa0bdf6d',
//             name: 'Manager',
//             order: 0,
//             signerPosition: null,
//             signerPositionId: null,
//             formTemplateId: 'c0f1fdee-278c-4977-86a2-89ae6a73ffb4',
//             createdAt: new Date(1672531200),
//             updatedAt: new Date(1672531200),
//           },
//         ],
//         formInstances: [],
//         createdAt: new Date(1672531200),
//         updatedAt: new Date(1672531200),
//       };

//       // const result = {
//       //   id: '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f',
//       //   name: 'Form Instance 1',
//       //   formDocLink: 'mfa.org/formtemplate1',
//       //   completed: false,
//       //   markedCompleted: false,
//       //   createdAt: new Date(1672531200),
//       //   updatedAt: new Date(1672531200),
//       //   completedAt: null,
//       //   markedCompletedAt: null,
//       //   originatorId: 'originatorId',
//       //   originator: {
//       //     id: 'originatorId',
//       //     firstName: 'First',
//       //     lastName: 'Last',
//       //     positionId: 'c25ac126-d450-4929-8982-0df70d3cd988',
//       //     position: {
//       //       id: 'c25ac126-d450-4929-8982-0df70d3cd988',
//       //       name: 'Associate',
//       //       single: true,
//       //       departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //       department: {
//       //         id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //         name: 'Archives',
//       //         createdAt: new Date(1672531200),
//       //         updatedAt: new Date(1672531200),
//       //       },
//       //       createdAt: new Date(1672531200),
//       //       updatedAt: new Date(1672531200),
//       //     },
//       //     email: 'user@mfa.org',
//       //     isAdmin: false,
//       //     pswdHash: 'password',
//       //     createdAt: new Date(1672531200),
//       //     updatedAt: new Date(1672531200),
//       //     refreshToken: null,
//       //   },
//       //   formTemplateId: 'c0f1fdee-278c-4977-86a2-89ae6a73ffb4',
//       //   formTemplate: {
//       //     id: 'c0f1fdee-278c-4977-86a2-89ae6a73ffb4',
//       //     name: 'Form Template 1',
//       //     formDocLink: 'mfa.org/formtemplate1',
//       //     createdAt: new Date(1672531200),
//       //     updatedAt: new Date(1672531200),
//       //   },
//       //   signatures: [
//       //     {
//       //       id: '63baef23-2ff1-40a2-89fe-e22b0ff8660e',
//       //       order: 0,
//       //       signed: false,
//       //       signedDocLink: null,
//       //       createdAt: new Date(1672531200),
//       //       updatedAt: new Date(1672531200),
//       //       signerPositionId: 'signerId',
//       //       signerPosition: {
//       //         id: 'signerId',
//       //         name: 'Manager',
//       //         single: true,
//       //         departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //         department: {
//       //           id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //           name: 'Archives',
//       //           createdAt: new Date(1672531200),
//       //           updatedAt: new Date(1672531200),
//       //         },
//       //         createdAt: new Date(1672531200),
//       //         updatedAt: new Date(1672531200),
//       //       },
//       //       userSignedById: null,
//       //       userSignedBy: null,
//       //       formInstanceId: '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f',
//       //     },
//       //   ],
//       // };

//       const expected = new FormInstanceEntity({
//         id: '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f',
//         name: 'Form Instance 1',
//         formDocLink: 'mfa.org/formtemplate1',
//         completed: false,
//         markedCompleted: false,
//         createdAt: new Date(1672531200),
//         updatedAt: new Date(1672531200),
//         completedAt: null,
//         markedCompletedAt: null,
//         originatorId: 'originatorId',
//         originator: new EmployeeEntity({
//           id: 'originatorId',
//           firstName: 'First',
//           lastName: 'Last',
//           positionId: 'c25ac126-d450-4929-8982-0df70d3cd988',
//           position: new PositionBaseEntity({
//             id: 'c25ac126-d450-4929-8982-0df70d3cd988',
//             name: 'Associate',
//             single: true,
//             departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//             department: new DepartmentEntity({
//               id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//               name: 'Archives',
//               createdAt: new Date(1672531200),
//               updatedAt: new Date(1672531200),
//             }),
//             createdAt: new Date(1672531200),
//             updatedAt: new Date(1672531200),
//           }),
//           email: 'user@mfa.org',
//           isAdmin: false,
//           pswdHash: 'password',
//           createdAt: new Date(1672531200),
//           updatedAt: new Date(1672531200),
//           refreshToken: null,
//         }),
//         formTemplateId: 'c0f1fdee-278c-4977-86a2-89ae6a73ffb4',
//         formTemplate: new FormTemplateEntity({
//           id: 'c0f1fdee-278c-4977-86a2-89ae6a73ffb4',
//           name: 'Form Template 1',
//           formDocLink: 'mfa.org/formtemplate1',
//           createdAt: new Date(1672531200),
//           updatedAt: new Date(1672531200),
//         }),
//         signatures: [
//           new SignatureEntity({
//             id: '63baef23-2ff1-40a2-89fe-e22b0ff8660e',
//             order: 0,
//             signed: false,
//             signedDocLink: null,
//             createdAt: new Date(1672531200),
//             updatedAt: new Date(1672531200),
//             signerPositionId: 'signerId',
//             signerPosition: new PositionBaseEntity({
//               id: 'signerId',
//               name: 'Manager',
//               single: true,
//               departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//               department: new DepartmentEntity({
//                 id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//                 name: 'Archives',
//                 createdAt: new Date(1672531200),
//                 updatedAt: new Date(1672531200),
//               }),
//               createdAt: new Date(1672531200),
//               updatedAt: new Date(1672531200),
//             }),
//             assignedUser: null,
//             assignedUserId: null,
//             formInstanceId: '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f',
//           }),
//         ],
//       });

//       jest
//         .spyOn(formTemplatesService, 'findOne')
//         .mockImplementation(async () => formTemplateResult);
//       // jest
//       //   .spyOn(formInstancesService, 'create')
//       //   .mockImplementation(async () => result);

//       expect(await controller.create(createFormInstanceDto)).toEqual(expected);
//     });
//   });

//   describe('findAll', () => {
//     it('should return an array of form instances', async () => {
//       // const result = [
//       //   {
//       //     id: '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f',
//       //     name: 'Form Instance',
//       //     formDocLink: 'mfa.org/form1',
//       //     completed: false,
//       //     markedCompleted: false,
//       //     createdAt: new Date(1672531200),
//       //     updatedAt: new Date(1672531200),
//       //     completedAt: null,
//       //     markedCompletedAt: null,
//       //     originatorId: 'affc3c9a-d96d-4fee-973d-c3f14b83a077',
//       //     originator: {
//       //       id: 'affc3c9a-d96d-4fee-973d-c3f14b83a077',
//       //       firstName: 'First',
//       //       lastName: 'Last',
//       //       positionId: 'c25ac126-d450-4929-8982-0df70d3cd988',
//       //       position: {
//       //         id: 'c25ac126-d450-4929-8982-0df70d3cd988',
//       //         name: 'Associate',
//       //         single: true,
//       //         departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //         department: {
//       //           id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //           name: 'Archives',
//       //           createdAt: new Date(1672531200),
//       //           updatedAt: new Date(1672531200),
//       //         },
//       //         createdAt: new Date(1672531200),
//       //         updatedAt: new Date(1672531200),
//       //       },
//       //       email: 'user@mfa.org',
//       //       isAdmin: false,
//       //       pswdHash: 'password',
//       //       createdAt: new Date(1672531200),
//       //       updatedAt: new Date(1672531200),
//       //       refreshToken: null,
//       //     },
//       //     formTemplateId: 'f6b24b94-c41d-4aee-992d-f1949a6e1f70',
//       //     formTemplate: {
//       //       id: 'c0f1fdee-278c-4977-86a2-89ae6a73ffb4',
//       //       name: 'Form Template 1',
//       //       formDocLink: 'mfa.org/formtemplate1',
//       //       createdAt: new Date(1672531200),
//       //       updatedAt: new Date(1672531200),
//       //     },
//       //     signatures: [
//       //       {
//       //         id: '63baef23-2ff1-40a2-89fe-e22b0ff8660e',
//       //         order: 0,
//       //         signed: false,
//       //         signedDocLink: null,
//       //         createdAt: new Date(1672531200),
//       //         updatedAt: new Date(1672531200),
//       //         signerPositionId: 'f244c232-c453-4394-8180-9b9a82725677',
//       //         signerPosition: {
//       //           id: 'f244c232-c453-4394-8180-9b9a82725677',
//       //           name: 'Manager',
//       //           single: true,
//       //           departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //           department: {
//       //             id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //             name: 'Archives',
//       //             createdAt: new Date(1672531200),
//       //             updatedAt: new Date(1672531200),
//       //           },
//       //           createdAt: new Date(1672531200),
//       //           updatedAt: new Date(1672531200),
//       //         },
//       //         userSignedById: null,
//       //         userSignedBy: null,
//       //         formInstanceId: '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f',
//       //       },
//       //       {
//       //         id: '49da79f1-e562-4686-a0ed-699e06ac0154',
//       //         order: 1,
//       //         signed: false,
//       //         signedDocLink: null,
//       //         createdAt: new Date(1672531200),
//       //         updatedAt: new Date(1672531200),
//       //         signerPositionId: '6d88b27c-457a-414b-866d-72ad1335ea23',
//       //         signerPosition: {
//       //           id: '6d88b27c-457a-414b-866d-72ad1335ea23',
//       //           name: 'Director',
//       //           single: true,
//       //           departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //           department: {
//       //             id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //             name: 'Archives',
//       //             createdAt: new Date(1672531200),
//       //             updatedAt: new Date(1672531200),
//       //           },
//       //           createdAt: new Date(1672531200),
//       //           updatedAt: new Date(1672531200),
//       //         },
//       //         userSignedById: null,
//       //         userSignedBy: null,
//       //         formInstanceId: '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f',
//       //       },
//       //     ],
//       //   },
//       //   {
//       //     id: '35a88841-4f45-4f9c-83a6-7a904f347ac7',
//       //     name: 'Form Instance 2',
//       //     formDocLink: 'mfa.org/form2',
//       //     completed: false,
//       //     markedCompleted: false,
//       //     createdAt: new Date(1672531200),
//       //     updatedAt: new Date(1672531200),
//       //     completedAt: null,
//       //     markedCompletedAt: null,
//       //     originatorId: 'affc3c9a-d96d-4fee-973d-c3f14b83a077',
//       //     originator: {
//       //       id: 'affc3c9a-d96d-4fee-973d-c3f14b83a077',
//       //       firstName: 'First',
//       //       lastName: 'Last',
//       //       positionId: 'c25ac126-d450-4929-8982-0df70d3cd988',
//       //       position: {
//       //         id: 'c25ac126-d450-4929-8982-0df70d3cd988',
//       //         name: 'Associate',
//       //         single: true,
//       //         departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //         department: {
//       //           id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //           name: 'Archives',
//       //           createdAt: new Date(1672531200),
//       //           updatedAt: new Date(1672531200),
//       //         },
//       //         createdAt: new Date(1672531200),
//       //         updatedAt: new Date(1672531200),
//       //       },
//       //       email: 'user@mfa.org',
//       //       isAdmin: false,
//       //       pswdHash: 'password',
//       //       createdAt: new Date(1672531200),
//       //       updatedAt: new Date(1672531200),
//       //       refreshToken: null,
//       //     },
//       //     formTemplateId: 'f6b24b94-c41d-4aee-992d-f1949a6e1f70',
//       //     formTemplate: {
//       //       id: 'c0f1fdee-278c-4977-86a2-89ae6a73ffb4',
//       //       name: 'Form Template 1',
//       //       formDocLink: 'mfa.org/formtemplate1',
//       //       createdAt: new Date(1672531200),
//       //       updatedAt: new Date(1672531200),
//       //     },
//       //     signatures: [
//       //       {
//       //         id: 'b0c4370a-ad18-48e9-8d5d-b89abf2a1d81',
//       //         order: 0,
//       //         signed: false,
//       //         signedDocLink: null,
//       //         createdAt: new Date(1672531200),
//       //         updatedAt: new Date(1672531200),
//       //         signerPositionId: 'f244c232-c453-4394-8180-9b9a82725677',
//       //         signerPosition: {
//       //           id: 'f244c232-c453-4394-8180-9b9a82725677',
//       //           name: 'Manager',
//       //           single: true,
//       //           departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //           department: {
//       //             id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //             name: 'Archives',
//       //             createdAt: new Date(1672531200),
//       //             updatedAt: new Date(1672531200),
//       //           },
//       //           createdAt: new Date(1672531200),
//       //           updatedAt: new Date(1672531200),
//       //         },
//       //         userSignedById: null,
//       //         userSignedBy: null,
//       //         formInstanceId: '35a88841-4f45-4f9c-83a6-7a904f347ac7',
//       //       },
//       //       {
//       //         id: '3e24d3ea-24a4-48fc-af07-e018cee7091c',
//       //         order: 1,
//       //         signed: false,
//       //         signedDocLink: null,
//       //         createdAt: new Date(1672531200),
//       //         updatedAt: new Date(1672531200),
//       //         signerPositionId: '6d88b27c-457a-414b-866d-72ad1335ea23',
//       //         signerPosition: {
//       //           id: '6d88b27c-457a-414b-866d-72ad1335ea23',
//       //           name: 'Director',
//       //           single: true,
//       //           departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //           department: {
//       //             id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //             name: 'Archives',
//       //             createdAt: new Date(1672531200),
//       //             updatedAt: new Date(1672531200),
//       //           },
//       //           createdAt: new Date(1672531200),
//       //           updatedAt: new Date(1672531200),
//       //         },
//       //         userSignedById: null,
//       //         userSignedBy: null,
//       //         formInstanceId: '35a88841-4f45-4f9c-83a6-7a904f347ac7',
//       //       },
//       //     ],
//       //   },
//       // ];

//       const expected = [
//         new FormInstanceEntity({
//           id: '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f',
//           name: 'Form Instance',
//           formDocLink: 'mfa.org/form1',
//           completed: false,
//           markedCompleted: false,
//           createdAt: new Date(1672531200),
//           updatedAt: new Date(1672531200),
//           completedAt: null,
//           markedCompletedAt: null,
//           originatorId: 'affc3c9a-d96d-4fee-973d-c3f14b83a077',
//           originator: new EmployeeEntity({
//             id: 'affc3c9a-d96d-4fee-973d-c3f14b83a077',
//             firstName: 'First',
//             lastName: 'Last',
//             positionId: 'c25ac126-d450-4929-8982-0df70d3cd988',
//             position: new PositionBaseEntity({
//               id: 'c25ac126-d450-4929-8982-0df70d3cd988',
//               name: 'Associate',
//               single: true,
//               departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//               department: new DepartmentEntity({
//                 id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//                 name: 'Archives',
//                 createdAt: new Date(1672531200),
//                 updatedAt: new Date(1672531200),
//               }),
//               createdAt: new Date(1672531200),
//               updatedAt: new Date(1672531200),
//             }),
//             email: 'user@mfa.org',
//             isAdmin: false,
//             pswdHash: 'password',
//             createdAt: new Date(1672531200),
//             updatedAt: new Date(1672531200),
//             refreshToken: null,
//           }),
//           formTemplateId: 'f6b24b94-c41d-4aee-992d-f1949a6e1f70',
//           formTemplate: new FormTemplateEntity({
//             id: 'c0f1fdee-278c-4977-86a2-89ae6a73ffb4',
//             name: 'Form Template 1',
//             formDocLink: 'mfa.org/formtemplate1',
//             createdAt: new Date(1672531200),
//             updatedAt: new Date(1672531200),
//           }),
//           signatures: [
//             new SignatureEntity({
//               id: '63baef23-2ff1-40a2-89fe-e22b0ff8660e',
//               order: 0,
//               signed: false,
//               signedDocLink: null,
//               createdAt: new Date(1672531200),
//               updatedAt: new Date(1672531200),
//               signerPositionId: 'f244c232-c453-4394-8180-9b9a82725677',
//               signerPosition: new PositionBaseEntity({
//                 id: 'f244c232-c453-4394-8180-9b9a82725677',
//                 name: 'Manager',
//                 single: true,
//                 departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//                 department: new DepartmentEntity({
//                   id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//                   name: 'Archives',
//                   createdAt: new Date(1672531200),
//                   updatedAt: new Date(1672531200),
//                 }),
//                 createdAt: new Date(1672531200),
//                 updatedAt: new Date(1672531200),
//               }),
//               assignedUserId: null,
//               assignedUser: null,
//               formInstanceId: '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f',
//             }),
//             new SignatureEntity({
//               id: '49da79f1-e562-4686-a0ed-699e06ac0154',
//               order: 1,
//               signed: false,
//               signedDocLink: null,
//               createdAt: new Date(1672531200),
//               updatedAt: new Date(1672531200),
//               signerPositionId: '6d88b27c-457a-414b-866d-72ad1335ea23',
//               signerPosition: new PositionBaseEntity({
//                 id: '6d88b27c-457a-414b-866d-72ad1335ea23',
//                 name: 'Director',
//                 single: true,
//                 departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//                 department: new DepartmentEntity({
//                   id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//                   name: 'Archives',
//                   createdAt: new Date(1672531200),
//                   updatedAt: new Date(1672531200),
//                 }),
//                 createdAt: new Date(1672531200),
//                 updatedAt: new Date(1672531200),
//               }),
//               assignedUserId: null,
//               assignedUser: null,
//               formInstanceId: '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f',
//             }),
//           ],
//         }),
//         new FormInstanceEntity({
//           id: '35a88841-4f45-4f9c-83a6-7a904f347ac7',
//           name: 'Form Instance 2',
//           formDocLink: 'mfa.org/form2',
//           completed: false,
//           markedCompleted: false,
//           createdAt: new Date(1672531200),
//           updatedAt: new Date(1672531200),
//           completedAt: null,
//           markedCompletedAt: null,
//           originatorId: 'affc3c9a-d96d-4fee-973d-c3f14b83a077',
//           originator: new EmployeeEntity({
//             id: 'affc3c9a-d96d-4fee-973d-c3f14b83a077',
//             firstName: 'First',
//             lastName: 'Last',
//             positionId: 'c25ac126-d450-4929-8982-0df70d3cd988',
//             position: new PositionBaseEntity({
//               id: 'c25ac126-d450-4929-8982-0df70d3cd988',
//               name: 'Associate',
//               single: true,
//               departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//               department: new DepartmentEntity({
//                 id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//                 name: 'Archives',
//                 createdAt: new Date(1672531200),
//                 updatedAt: new Date(1672531200),
//               }),
//               createdAt: new Date(1672531200),
//               updatedAt: new Date(1672531200),
//             }),
//             email: 'user@mfa.org',
//             isAdmin: false,
//             pswdHash: 'password',
//             createdAt: new Date(1672531200),
//             updatedAt: new Date(1672531200),
//             refreshToken: null,
//           }),
//           formTemplateId: 'f6b24b94-c41d-4aee-992d-f1949a6e1f70',
//           formTemplate: new FormTemplateEntity({
//             id: 'c0f1fdee-278c-4977-86a2-89ae6a73ffb4',
//             name: 'Form Template 1',
//             formDocLink: 'mfa.org/formtemplate1',
//             createdAt: new Date(1672531200),
//             updatedAt: new Date(1672531200),
//           }),
//           signatures: [
//             {
//               id: 'b0c4370a-ad18-48e9-8d5d-b89abf2a1d81',
//               order: 0,
//               signed: false,
//               signedDocLink: null,
//               createdAt: new Date(1672531200),
//               updatedAt: new Date(1672531200),
//               signerPositionId: 'f244c232-c453-4394-8180-9b9a82725677',
//               signerPosition: new PositionBaseEntity({
//                 id: 'f244c232-c453-4394-8180-9b9a82725677',
//                 name: 'Manager',
//                 single: true,
//                 departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//                 department: {
//                   id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//                   name: 'Archives',
//                   createdAt: new Date(1672531200),
//                   updatedAt: new Date(1672531200),
//                 },
//                 createdAt: new Date(1672531200),
//                 updatedAt: new Date(1672531200),
//               }),
//               assignedUserId: null,
//               assignedUser: null,
//               formInstanceId: '35a88841-4f45-4f9c-83a6-7a904f347ac7',
//             },
//             {
//               id: '3e24d3ea-24a4-48fc-af07-e018cee7091c',
//               order: 1,
//               signed: false,
//               signedDocLink: null,
//               createdAt: new Date(1672531200),
//               updatedAt: new Date(1672531200),
//               signerPositionId: '6d88b27c-457a-414b-866d-72ad1335ea23',
//               signerPosition: {
//                 id: '6d88b27c-457a-414b-866d-72ad1335ea23',
//                 name: 'Director',
//                 single: true,
//                 departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//                 department: {
//                   id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//                   name: 'Archives',
//                   createdAt: new Date(1672531200),
//                   updatedAt: new Date(1672531200),
//                 },
//                 createdAt: new Date(1672531200),
//                 updatedAt: new Date(1672531200),
//               },
//               assignedUserId: null,
//               assignedUser: null,
//               formInstanceId: '35a88841-4f45-4f9c-83a6-7a904f347ac7',
//             },
//           ],
//         }),
//       ];

//       // jest
//       //   .spyOn(formInstancesService, 'findAll')
//       //   .mockImplementation(async () => result);

//       // expect(await controller.findAll(10)).toEqual(expected);
//     });
//   });

//   describe('findOne', () => {
//     it('should find a form instance by id', async () => {
//       const formInstanceId = '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f';
//       // const result = (formInstanceId: string) => {
//       //   return {
//       //     id: formInstanceId,
//       //     name: 'Form Instance',
//       //     formDocLink: 'mfa.org/form1',
//       //     completed: false,
//       //     markedCompleted: false,
//       //     createdAt: new Date(1672531200),
//       //     updatedAt: new Date(1672531200),
//       //     completedAt: null,
//       //     markedCompletedAt: null,
//       //     originatorId: 'affc3c9a-d96d-4fee-973d-c3f14b83a077',
//       //     originator: {
//       //       id: 'affc3c9a-d96d-4fee-973d-c3f14b83a077',
//       //       firstName: 'First',
//       //       lastName: 'Last',
//       //       positionId: 'c25ac126-d450-4929-8982-0df70d3cd988',
//       //       position: {
//       //         id: 'c25ac126-d450-4929-8982-0df70d3cd988',
//       //         name: 'Associate',
//       //         single: true,
//       //         departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //         department: {
//       //           id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //           name: 'Archives',
//       //           createdAt: new Date(1672531200),
//       //           updatedAt: new Date(1672531200),
//       //         },
//       //         createdAt: new Date(1672531200),
//       //         updatedAt: new Date(1672531200),
//       //       },
//       //       email: 'user@mfa.org',
//       //       isAdmin: false,
//       //       pswdHash: 'password',
//       //       createdAt: new Date(1672531200),
//       //       updatedAt: new Date(1672531200),
//       //       refreshToken: null,
//       //     },
//       //     formTemplateId: 'f6b24b94-c41d-4aee-992d-f1949a6e1f70',
//       //     formTemplate: {
//       //       id: 'c0f1fdee-278c-4977-86a2-89ae6a73ffb4',
//       //       name: 'Form Template 1',
//       //       formDocLink: 'mfa.org/formtemplate1',
//       //       createdAt: new Date(1672531200),
//       //       updatedAt: new Date(1672531200),
//       //     },
//       //     signatures: [
//       //       {
//       //         id: '63baef23-2ff1-40a2-89fe-e22b0ff8660e',
//       //         order: 0,
//       //         signed: false,
//       //         signedDocLink: null,
//       //         createdAt: new Date(1672531200),
//       //         updatedAt: new Date(1672531200),
//       //         signerPositionId: 'f244c232-c453-4394-8180-9b9a82725677',
//       //         signerPosition: {
//       //           id: 'f244c232-c453-4394-8180-9b9a82725677',
//       //           name: 'Manager',
//       //           single: true,
//       //           departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //           department: {
//       //             id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //             name: 'Archives',
//       //             createdAt: new Date(1672531200),
//       //             updatedAt: new Date(1672531200),
//       //           },
//       //           createdAt: new Date(1672531200),
//       //           updatedAt: new Date(1672531200),
//       //         },
//       //         userSignedById: null,
//       //         userSignedBy: null,
//       //         formInstanceId: formInstanceId,
//       //       },
//       //       {
//       //         id: '49da79f1-e562-4686-a0ed-699e06ac0154',
//       //         order: 1,
//       //         signed: false,
//       //         signedDocLink: null,
//       //         createdAt: new Date(1672531200),
//       //         updatedAt: new Date(1672531200),
//       //         signerPositionId: '6d88b27c-457a-414b-866d-72ad1335ea23',
//       //         signerPosition: {
//       //           id: '6d88b27c-457a-414b-866d-72ad1335ea23',
//       //           name: 'Director',
//       //           single: true,
//       //           departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //           department: {
//       //             id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //             name: 'Archives',
//       //             createdAt: new Date(1672531200),
//       //             updatedAt: new Date(1672531200),
//       //           },
//       //           createdAt: new Date(1672531200),
//       //           updatedAt: new Date(1672531200),
//       //         },
//       //         userSignedById: null,
//       //         userSignedBy: null,
//       //         formInstanceId: formInstanceId,
//       //       },
//       //     ],
//       //   };
//       // };

//       const expected = new FormInstanceEntity({
//         id: '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f',
//         name: 'Form Instance',
//         formDocLink: 'mfa.org/form1',
//         completed: false,
//         markedCompleted: false,
//         createdAt: new Date(1672531200),
//         updatedAt: new Date(1672531200),
//         completedAt: null,
//         markedCompletedAt: null,
//         originatorId: 'affc3c9a-d96d-4fee-973d-c3f14b83a077',
//         originator: new EmployeeEntity({
//           id: 'affc3c9a-d96d-4fee-973d-c3f14b83a077',
//           firstName: 'First',
//           lastName: 'Last',
//           positionId: 'c25ac126-d450-4929-8982-0df70d3cd988',
//           position: new PositionBaseEntity({
//             id: 'c25ac126-d450-4929-8982-0df70d3cd988',
//             name: 'Associate',
//             single: true,
//             departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//             department: new DepartmentEntity({
//               id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//               name: 'Archives',
//               createdAt: new Date(1672531200),
//               updatedAt: new Date(1672531200),
//             }),
//             createdAt: new Date(1672531200),
//             updatedAt: new Date(1672531200),
//           }),
//           email: 'user@mfa.org',
//           isAdmin: false,
//           pswdHash: 'password',
//           createdAt: new Date(1672531200),
//           updatedAt: new Date(1672531200),
//           refreshToken: null,
//         }),
//         formTemplateId: 'f6b24b94-c41d-4aee-992d-f1949a6e1f70',
//         formTemplate: new FormTemplateEntity({
//           id: 'c0f1fdee-278c-4977-86a2-89ae6a73ffb4',
//           name: 'Form Template 1',
//           formDocLink: 'mfa.org/formtemplate1',
//           createdAt: new Date(1672531200),
//           updatedAt: new Date(1672531200),
//         }),
//         signatures: [
//           new SignatureEntity({
//             id: '63baef23-2ff1-40a2-89fe-e22b0ff8660e',
//             order: 0,
//             signed: false,
//             signedDocLink: null,
//             createdAt: new Date(1672531200),
//             updatedAt: new Date(1672531200),
//             signerPositionId: 'f244c232-c453-4394-8180-9b9a82725677',
//             signerPosition: new PositionBaseEntity({
//               id: 'f244c232-c453-4394-8180-9b9a82725677',
//               name: 'Manager',
//               single: true,
//               departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//               department: new DepartmentEntity({
//                 id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//                 name: 'Archives',
//                 createdAt: new Date(1672531200),
//                 updatedAt: new Date(1672531200),
//               }),
//               createdAt: new Date(1672531200),
//               updatedAt: new Date(1672531200),
//             }),
//             assignedUserId: null,
//             assignedUser: null,
//             formInstanceId: '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f',
//           }),
//           new SignatureEntity({
//             id: '49da79f1-e562-4686-a0ed-699e06ac0154',
//             order: 1,
//             signed: false,
//             signedDocLink: null,
//             createdAt: new Date(1672531200),
//             updatedAt: new Date(1672531200),
//             signerPositionId: '6d88b27c-457a-414b-866d-72ad1335ea23',
//             signerPosition: new PositionBaseEntity({
//               id: '6d88b27c-457a-414b-866d-72ad1335ea23',
//               name: 'Director',
//               single: true,
//               departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//               department: new DepartmentEntity({
//                 id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//                 name: 'Archives',
//                 createdAt: new Date(1672531200),
//                 updatedAt: new Date(1672531200),
//               }),
//               createdAt: new Date(1672531200),
//               updatedAt: new Date(1672531200),
//             }),
//             assignedUserId: null,
//             assignedUser: null,
//             formInstanceId: '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f',
//           }),
//         ],
//       });

//       // jest
//       //   .spyOn(formInstancesService, 'findOne')
//       //   .mockImplementation(async (formInstanceId) => result(formInstanceId));

//       expect(await controller.findOne(formInstanceId)).toEqual(expected);
//     });

//     it('should raise an error if not found', async () => {
//       const formInstanceId = '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f';

//       jest
//         .spyOn(formInstancesService, 'findOne')
//         .mockImplementation(async () => null);

//       expect(controller.findOne(formInstanceId)).rejects.toThrowError(
//         NotFoundException,
//       );
//     });
//   });

//   describe('update', () => {
//     const formInstanceId = 'formInstanceId';
//     const newFormInstanceName = 'Updated Form Instance Name';
//     const updateFormInstanceDto = {
//       name: newFormInstanceName,
//     };

//     it('should update a form instance with id', async () => {
//       // const result = (formInstanceId: string) => {
//       //   return {
//       //     id: formInstanceId,
//       //     name: newFormInstanceName,
//       //     formDocLink: 'mfa.org/form1',
//       //     completed: false,
//       //     markedCompleted: false,
//       //     createdAt: new Date(1672531200),
//       //     updatedAt: new Date(1672531200),
//       //     completedAt: null,
//       //     markedCompletedAt: null,
//       //     originatorId: 'affc3c9a-d96d-4fee-973d-c3f14b83a077',
//       //     originator: {
//       //       id: 'affc3c9a-d96d-4fee-973d-c3f14b83a077',
//       //       firstName: 'First',
//       //       lastName: 'Last',
//       //       positionId: 'c25ac126-d450-4929-8982-0df70d3cd988',
//       //       position: {
//       //         id: 'c25ac126-d450-4929-8982-0df70d3cd988',
//       //         name: 'Associate',
//       //         single: true,
//       //         departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //         department: {
//       //           id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //           name: 'Archives',
//       //           createdAt: new Date(1672531200),
//       //           updatedAt: new Date(1672531200),
//       //         },
//       //         createdAt: new Date(1672531200),
//       //         updatedAt: new Date(1672531200),
//       //       },
//       //       email: 'user@mfa.org',
//       //       isAdmin: false,
//       //       pswdHash: 'password',
//       //       createdAt: new Date(1672531200),
//       //       updatedAt: new Date(1672531200),
//       //       refreshToken: null,
//       //     },
//       //     formTemplateId: 'f6b24b94-c41d-4aee-992d-f1949a6e1f70',
//       //     formTemplate: {
//       //       id: 'c0f1fdee-278c-4977-86a2-89ae6a73ffb4',
//       //       name: 'Form Template 1',
//       //       formDocLink: 'mfa.org/formtemplate1',
//       //       createdAt: new Date(1672531200),
//       //       updatedAt: new Date(1672531200),
//       //     },
//       //     signatures: [
//       //       {
//       //         id: '63baef23-2ff1-40a2-89fe-e22b0ff8660e',
//       //         order: 0,
//       //         signed: false,
//       //         signedDocLink: null,
//       //         createdAt: new Date(1672531200),
//       //         updatedAt: new Date(1672531200),
//       //         signerPositionId: 'f244c232-c453-4394-8180-9b9a82725677',
//       //         signerPosition: {
//       //           id: 'f244c232-c453-4394-8180-9b9a82725677',
//       //           name: 'Manager',
//       //           single: true,
//       //           departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //           department: {
//       //             id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //             name: 'Archives',
//       //             createdAt: new Date(1672531200),
//       //             updatedAt: new Date(1672531200),
//       //           },
//       //           createdAt: new Date(1672531200),
//       //           updatedAt: new Date(1672531200),
//       //         },
//       //         userSignedById: null,
//       //         userSignedBy: null,
//       //         formInstanceId: formInstanceId,
//       //       },
//       //       {
//       //         id: '49da79f1-e562-4686-a0ed-699e06ac0154',
//       //         order: 1,
//       //         signed: false,
//       //         signedDocLink: null,
//       //         createdAt: new Date(1672531200),
//       //         updatedAt: new Date(1672531200),
//       //         signerPositionId: '6d88b27c-457a-414b-866d-72ad1335ea23',
//       //         signerPosition: {
//       //           id: '6d88b27c-457a-414b-866d-72ad1335ea23',
//       //           name: 'Director',
//       //           single: true,
//       //           departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //           department: {
//       //             id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//       //             name: 'Archives',
//       //             createdAt: new Date(1672531200),
//       //             updatedAt: new Date(1672531200),
//       //           },
//       //           createdAt: new Date(1672531200),
//       //           updatedAt: new Date(1672531200),
//       //         },
//       //         userSignedById: null,
//       //         userSignedBy: null,
//       //         formInstanceId: formInstanceId,
//       //       },
//       //     ],
//       //   };
//       // };

//       const expected = new FormInstanceEntity({
//         id: formInstanceId,
//         name: newFormInstanceName,
//         formDocLink: 'mfa.org/form1',
//         completed: false,
//         markedCompleted: false,
//         createdAt: new Date(1672531200),
//         updatedAt: new Date(1672531200),
//         completedAt: null,
//         markedCompletedAt: null,
//         originatorId: 'affc3c9a-d96d-4fee-973d-c3f14b83a077',
//         originator: new EmployeeEntity({
//           id: 'affc3c9a-d96d-4fee-973d-c3f14b83a077',
//           firstName: 'First',
//           lastName: 'Last',
//           positionId: 'c25ac126-d450-4929-8982-0df70d3cd988',
//           position: new PositionBaseEntity({
//             id: 'c25ac126-d450-4929-8982-0df70d3cd988',
//             name: 'Associate',
//             single: true,
//             departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//             department: new DepartmentEntity({
//               id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//               name: 'Archives',
//               createdAt: new Date(1672531200),
//               updatedAt: new Date(1672531200),
//             }),
//             createdAt: new Date(1672531200),
//             updatedAt: new Date(1672531200),
//           }),
//           email: 'user@mfa.org',
//           isAdmin: false,
//           pswdHash: 'password',
//           createdAt: new Date(1672531200),
//           updatedAt: new Date(1672531200),
//           refreshToken: null,
//         }),
//         formTemplateId: 'f6b24b94-c41d-4aee-992d-f1949a6e1f70',
//         formTemplate: new FormTemplateEntity({
//           id: 'c0f1fdee-278c-4977-86a2-89ae6a73ffb4',
//           name: 'Form Template 1',
//           formDocLink: 'mfa.org/formtemplate1',
//           createdAt: new Date(1672531200),
//           updatedAt: new Date(1672531200),
//         }),
//         signatures: [
//           new SignatureEntity({
//             id: '63baef23-2ff1-40a2-89fe-e22b0ff8660e',
//             order: 0,
//             signed: false,
//             signedDocLink: null,
//             createdAt: new Date(1672531200),
//             updatedAt: new Date(1672531200),
//             signerPositionId: 'f244c232-c453-4394-8180-9b9a82725677',
//             signerPosition: new PositionBaseEntity({
//               id: 'f244c232-c453-4394-8180-9b9a82725677',
//               name: 'Manager',
//               single: true,
//               departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//               department: new DepartmentEntity({
//                 id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//                 name: 'Archives',
//                 createdAt: new Date(1672531200),
//                 updatedAt: new Date(1672531200),
//               }),
//               createdAt: new Date(1672531200),
//               updatedAt: new Date(1672531200),
//             }),
//             assignedUserId: null,
//             assignedUser: null,
//             formInstanceId: formInstanceId,
//           }),
//           new SignatureEntity({
//             id: '49da79f1-e562-4686-a0ed-699e06ac0154',
//             order: 1,
//             signed: false,
//             signedDocLink: null,
//             createdAt: new Date(1672531200),
//             updatedAt: new Date(1672531200),
//             signerPositionId: '6d88b27c-457a-414b-866d-72ad1335ea23',
//             signerPosition: new PositionBaseEntity({
//               id: '6d88b27c-457a-414b-866d-72ad1335ea23',
//               name: 'Director',
//               single: true,
//               departmentId: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//               department: new DepartmentEntity({
//                 id: '42c2a72d-7a8e-44bb-9298-a2eb3ce830de',
//                 name: 'Archives',
//                 createdAt: new Date(1672531200),
//                 updatedAt: new Date(1672531200),
//               }),
//               createdAt: new Date(1672531200),
//               updatedAt: new Date(1672531200),
//             }),
//             assignedUserId: null,
//             assignedUser: null,
//             formInstanceId: formInstanceId,
//           }),
//         ],
//       });

//       // jest
//       //   .spyOn(formInstancesService, 'update')
//       //   .mockImplementation(async (formInstanceId) => result(formInstanceId));

//       expect(
//         await controller.update(formInstanceId, updateFormInstanceDto),
//       ).toEqual(expected);
//     });

//     it('should raise an error if not found', async () => {
//       jest
//         .spyOn(formInstancesService, 'update')
//         .mockImplementation(async () => {
//           throw new Prisma.PrismaClientKnownRequestError('', {
//             code: 'P2025',
//             clientVersion: '',
//             meta: undefined,
//             batchRequestIdx: undefined,
//           });
//         });

//       expect(
//         controller.update(formInstanceId, updateFormInstanceDto),
//       ).rejects.toThrowError(NotFoundException);
//     });
//   });

//   describe('remove', () => {
//     it('should delete a form instance with id', async () => {
//       const formInstanceId = '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f';

//       jest
//         .spyOn(formInstancesService, 'remove')
//         .mockImplementation(async () => {});

//       expect(await controller.remove(formInstanceId)).toEqual(undefined);
//     });

//     it('should raise an error if not found', async () => {
//       const formInstanceId = '38bb3b3f-e7eb-4686-99b8-6a51e6081d8f';

//       jest
//         .spyOn(formInstancesService, 'remove')
//         .mockImplementation(async () => {
//           throw new Prisma.PrismaClientKnownRequestError('', {
//             code: 'P2025',
//             clientVersion: '',
//             meta: undefined,
//             batchRequestIdx: undefined,
//           });
//         });

//       expect(controller.remove(formInstanceId)).rejects.toThrowError(
//         NotFoundException,
//       );
//     });
//   });
// });
