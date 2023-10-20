import { Test, TestingModule } from '@nestjs/testing';
import { FormInstancesService } from './form-instances.service';
import { PrismaService } from '../prisma/prisma.service';
import { FormTemplatesService } from '../form-templates/form-templates.service';

const formInstance1Id = 'formInstanceId1';
const formInstance2Id = 'formInstanceId2';
const formInstance3Id = 'formInstanceId3';
const formInstance1Name = 'Form-Instance-1';
const formInstance2Name = 'Form-Instance-2';
const formInstance3Name = 'Form-Instance-3';
const departmentId = 'departmentId';
const department = {
  id: departmentId,
  name: 'Archives',
  createdAt: new Date(1672531200),
  updatedAt: new Date(1672531200),
};
const positionId1 = 'positionId1';
const positionId2 = 'positionId2';
const positionId3 = 'positionId3';
const position1 = {
  id: positionId1,
  name: 'Manager',
  single: true,
  departmentId: departmentId,
  department: department,
  createdAt: new Date(1672531200),
  updatedAt: new Date(1672531200),
};
const position2 = {
  id: positionId2,
  name: 'Senior Manager',
  single: true,
  departmentId: departmentId,
  department: department,
  createdAt: new Date(1672531200),
  updatedAt: new Date(1672531200),
};
const position3 = {
  id: positionId3,
  name: 'Associate',
  single: true,
  departmentId: departmentId,
  department: department,
  createdAt: new Date(1672531200),
  updatedAt: new Date(1672531200),
};
const originatorId1 = 'originatorId1';
const originatorId2 = 'originatorId2';
const originator1 = {
  id: originatorId1,
  firstName: 'First',
  lastName: 'Last',
  positionId: positionId1,
  position: position1,
  email: 'info1@mfa.org',
  pswdHash: 'password',
  createdAt: new Date(1672531200),
  updatedAt: new Date(1672531200),
};
const originator2 = {
  id: originatorId2,
  firstName: 'Also First',
  lastName: 'And Last',
  positionId: positionId2,
  position: position2,
  email: 'info2@mfa.org',
  pswdHash: 'password',
  createdAt: new Date(1672531200),
  updatedAt: new Date(1672531200),
};
const formTemplateId = 'form-template-id';
const formTemplate = {
  id: formTemplateId,
  name: 'Form-Template-1',
  formDocLink: 'mfa.org/form1',
  createdAt: new Date(1672531200),
  updatedAt: new Date(1672531200),
};
const signatureId1 = 'signatureId1';
const signatureId2 = 'signatureId1';
const signatureId3 = 'signatureId1';
const signatureId4 = 'signatureId1';

const formInstancesArray = [
  {
    id: formInstance1Id,
    name: formInstance1Name,
    formDocLink: '',
    completed: false,
    createdAt: new Date(1672531200),
    updatedAt: new Date(1672531200),
    originatorId: originatorId1,
    originator: originator1,
    formTemplateId: formTemplateId,
    formTemplate: formTemplate,
    signatures: [
      {
        id: signatureId1,
        order: 0,
        signed: false,
        signedDocLink: null,
        createdAt: new Date(1672531200),
        updatedAt: new Date(1672531200),
        signerPositionId: positionId3,
        signerPosition: position3,
        userSignedById: null,
        userSignedBy: null,
        formInstanceId: formInstance1Id,
      },
      {
        id: signatureId2,
        order: 1,
        signed: false,
        signedDocLink: null,
        createdAt: new Date(1672531200),
        updatedAt: new Date(1672531200),
        signerPositionId: positionId2,
        signerPosition: position2,
        userSignedById: null,
        userSignedBy: null,
        formInstanceId: formInstance1Id,
      },
    ],
  },
  {
    id: formInstance2Id,
    name: formInstance2Name,
    formDocLink: '',
    completed: false,
    createdAt: new Date(1672531200),
    updatedAt: new Date(1672531200),
    originatorId: originatorId1,
    originator: originator1,
    formTemplateId: formTemplateId,
    formTemplate: formTemplate,
    signatures: [
      {
        id: signatureId3,
        order: 0,
        signed: false,
        signedDocLink: null,
        createdAt: new Date(1672531200),
        updatedAt: new Date(1672531200),
        signerPositionId: positionId3,
        signerPosition: position3,
        userSignedById: null,
        userSignedBy: null,
        formInstanceId: formInstance2Id,
      },
    ],
  },
  {
    id: formInstance3Id,
    name: formInstance3Name,
    formDocLink: '',
    completed: false,
    createdAt: new Date(1672531200),
    updatedAt: new Date(1672531200),
    originatorId: originatorId2,
    originator: originator2,
    formTemplateId: formTemplateId,
    formTemplate: formTemplate,
    signatures: [
      {
        id: signatureId4,
        order: 0,
        signed: false,
        signedDocLink: null,
        createdAt: new Date(1672531200),
        updatedAt: new Date(1672531200),
        signerPositionId: positionId1,
        signerPosition: position1,
        userSignedById: null,
        userSignedBy: null,
        formInstanceId: formInstance3Id,
      },
    ],
  },
];

const oneFormInstance = formInstancesArray[0];

const db = {
  formInstance: {
    findMany: jest.fn().mockResolvedValue(formInstancesArray),
    findUnique: jest.fn().mockResolvedValue(oneFormInstance),
    findFirst: jest.fn().mockResolvedValue(oneFormInstance),
    findFirstOrThrow: jest.fn().mockResolvedValue(oneFormInstance),
    create: jest.fn().mockReturnValue(oneFormInstance),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(oneFormInstance),
    delete: jest.fn().mockResolvedValue(oneFormInstance),
  },
  formTemplate: {
    findFirstOrThrow: jest.fn().mockResolvedValue(formTemplate),
  },
};

describe('FormInstancesService', () => {
  let service: FormInstancesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormInstancesService,
        FormTemplatesService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<FormInstancesService>(FormInstancesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a form instance', () => {
      const createFormInstanceDto = {
        name: formInstance1Name,
        signatures: [
          {
            order: 0,
            signerPositionId: 'signer-position-id-1',
          },
          {
            order: 1,
            signerPositionId: 'signer-position-id-2',
          },
        ],
        originatorId: 'originator-id',
        formTemplateId: 'form-template-id',
      };

      expect(service.create(createFormInstanceDto)).resolves.toEqual(
        oneFormInstance,
      );
    });
  });

  // WORK IN PROGRESS
  // describe('findAssignedTo', () => {
  //   beforeEach(async () => {
  //     db.formInstance.findMany = jest
  //       .fn()
  //       .mockResolvedValue(
  //         formInstancesArray.slice(formInstancesArray.length - 1),
  //       );
  //   });

  //   it('should successfully find all form instances assigned to an employee', () => {
  //     expect(service.findAssignedTo(originatorId2)).resolves.toEqual(
  //       formInstancesArray.slice(formInstancesArray.length - 1),
  //     );
  //   });

  //   afterEach(async () => {
  //     db.formInstance.findMany = jest
  //       .fn()
  //       .mockResolvedValue(formInstancesArray);
  //   });
  // });

  describe('findCreatedBy', () => {
    beforeEach(async () => {
      db.formInstance.findMany = jest
        .fn()
        .mockResolvedValue(
          formInstancesArray.slice(formInstancesArray.length - 1),
        );
    });

    it('should successfully find all form instances created by an employee', () => {
      expect(service.findCreatedBy(originatorId2)).resolves.toEqual(
        formInstancesArray.slice(formInstancesArray.length - 1),
      );
    });

    afterEach(async () => {
      db.formInstance.findMany = jest
        .fn()
        .mockResolvedValue(formInstancesArray);
    });
  });

  describe('findAll', () => {
    it('should successfully find all form instances', () => {
      expect(service.findAll()).resolves.toEqual(formInstancesArray);
    });
  });

  describe('findOne', () => {
    it('should find a form instance by id', () => {
      expect(service.findOne(formInstance1Id)).resolves.toEqual(
        oneFormInstance,
      );
    });
  });

  describe('update', () => {
    it('should call the update method', async () => {
      const newFormInstanceName = 'New-Form-Instance-Name';
      const updateFormInstanceDto = {
        name: newFormInstanceName,
      };

      const updatedFormInstance = await service.update(
        formInstance1Id,
        updateFormInstanceDto,
      );
      expect(updatedFormInstance).toEqual(oneFormInstance);
    });
  });

  describe('delete', () => {
    it('should successfully delete a form instance', async () => {
      await service.remove(formInstance1Id);
      expect(prismaService.formInstance.delete).toHaveBeenCalledTimes(1);
    });
  });
});
