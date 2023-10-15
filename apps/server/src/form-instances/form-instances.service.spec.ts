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
const originatorId = 'originatorId';
const originator = {
  id: originatorId,
  firstName: 'First',
  lastName: 'Last',
  positionId: 'positionId',
  position: {
    id: 'positionId',
    name: 'Manager',
    single: true,
    departmentId: 'departmentId',
    department: {
      id: 'departmentId',
      name: 'Archives',
      createdAt: new Date(1672531200),
      updatedAt: new Date(1672531200),
    },
    createdAt: new Date(1672531200),
    updatedAt: new Date(1672531200),
  },
  email: 'info@mfa.org',
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

const formInstancesArray = [
  {
    id: formInstance1Id,
    name: formInstance1Name,
    formDocLink: '',
    completed: false,
    createdAt: new Date(1672531200),
    updatedAt: new Date(1672531200),
    originatorId: originatorId,
    originator: originator,
    formTemplateId: formTemplateId,
    formTemplate: formTemplate,
    signatures: [
      {
        id: 'signatureId1',
        order: 0,
        signed: false,
        signedDocLink: null,
        createdAt: new Date(1672531200),
        updatedAt: new Date(1672531200),
        signerPositionId: null,
        signerPosition: null,
        userSignedById: null,
        userSignedBy: null,
        formInstanceId: formInstance1Id,
      },
      {
        id: 'signatureId2',
        order: 1,
        signed: false,
        signedDocLink: null,
        createdAt: new Date(1672531200),
        updatedAt: new Date(1672531200),
        signerPositionId: null,
        signerPosition: null,
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
    originatorId: originatorId,
    originator: originator,
    formTemplateId: formTemplateId,
    formTemplate: formTemplate,
    signatures: [
      {
        id: 'signatureId1',
        order: 0,
        signed: false,
        signedDocLink: null,
        createdAt: new Date(1672531200),
        updatedAt: new Date(1672531200),
        signerPositionId: null,
        signerPosition: null,
        userSignedById: null,
        userSignedBy: null,
        formInstanceId: formInstance2Id,
      },
      {
        id: 'signatureId2',
        order: 1,
        signed: false,
        signedDocLink: null,
        createdAt: new Date(1672531200),
        updatedAt: new Date(1672531200),
        signerPositionId: null,
        signerPosition: null,
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
    originatorId: originatorId,
    originator: originator,
    formTemplateId: formTemplateId,
    formTemplate: formTemplate,
    signatures: [
      {
        id: 'signatureId1',
        order: 0,
        signed: false,
        signedDocLink: null,
        createdAt: new Date(1672531200),
        updatedAt: new Date(1672531200),
        signerPositionId: null,
        signerPosition: null,
        userSignedById: null,
        userSignedBy: null,
        formInstanceId: formInstance3Id,
      },
      {
        id: 'signatureId2',
        order: 1,
        signed: false,
        signedDocLink: null,
        createdAt: new Date(1672531200),
        updatedAt: new Date(1672531200),
        signerPositionId: null,
        signerPosition: null,
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
