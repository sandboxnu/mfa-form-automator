import { Test, TestingModule } from '@nestjs/testing';
import { FormTemplatesController } from './form-templates.controller';
import { FormTemplatesService } from './form-templates.service';
import { PrismaService } from './../../../server/src/prisma/prisma.service';
import { FormTemplateEntity } from './entities/form-template.entity';
import { SignatureFieldEntity } from './../signature-fields/entities/signature-field.entity';

describe('FormTemplatesController', () => {
  let controller: FormTemplatesController;
  let service: FormTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormTemplatesController],
      providers: [FormTemplatesService, PrismaService],
    }).compile();

    controller = module.get<FormTemplatesController>(FormTemplatesController);
    service = module.get<FormTemplatesService>(FormTemplatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new form template', async () => {
      const createFormTemplateDto = {
        name: "Form Template 1",
        formDocLink: "mfa.org/formtemplate1",
        signatureFields: [
          {
            name: 'Signature Field 1',
            order: 0,
            signerPositionId: 'positionId',
            formTemplateId: 'formTemplateId'
          }
        ]
      }

      const result = {
        id: "c0003f3a-d2b5-4af8-a0dc-a8b80b5abf38",
        name: "Form Template 1",
        formDocLink: "mfa.org/formtemplate1",
        createdAt: new Date(1672531200),
        updatedAt: new Date(1672531200),
        signatureFields: [
          {
            name: 'Signature Field 1',
            order: 0,
            signerPositionId: 'positionId',
            formTemplateId: 'formTemplateId'
          }
        ]
      }

      const expected = new FormTemplateEntity({
        id: "c0003f3a-d2b5-4af8-a0dc-a8b80b5abf38",
        name: "Form Template 1",
        formDocLink: "mfa.org/formtemplate1",
        createdAt: new Date(1672531200),
        updatedAt: new Date(1672531200),
        signatureFields: [
          new SignatureFieldEntity({
            name: 'Signature Field 1',
            order: 0,
            signerPositionId: 'positionId',
            formTemplateId: 'formTemplateId'
          }),
        ],
      });

      jest
        .spyOn(service, 'create')
        .mockImplementation(async () => result);

      expect(await controller.create(createFormTemplateDto)).toEqual(expected);
  })});

  describe('findAll', () => {
    it('should return an array of form templates', async () => {
      const result = [
        {
          id: 'b08fd59b-15f5-4e35-9fed-12d531d3f5f0',
          name: 'Form Template 1',
          formDocLink: 'mfa.org/formtemplate1',
          createdAt: new Date(1672531200),
          updatedAt: new Date(1672531200),
          signatureFields: [
            {
              name: 'Signature Field 1',
              order: 0,
              signerPositionId: '427e2bbd-adcb-4a01-994c-0deeb98ffd62',
              formTemplateId: 'formTemplateId'
            },
            {
              name: 'Signature Field 2',
              order: 1,
              signerPositionId: 'd7c0be9d-4179-4ad2-a04a-37d3f2ad137c',
              formTemplateId: 'formTemplateId'
            }
          ]
        },
        {
          id: '1945de5f-f9f5-4f3e-801f-71f0e20efb7f',
          name: 'Form Template 2',
          formDocLink: 'mfa.org/formtemplate2',
          createdAt: new Date(1672531200),
          updatedAt: new Date(1672531200),
          signatureFields: [
            {
              name: 'Signature Field 1',
              order: 0,
              signerPositionId: '427e2bbd-adcb-4a01-994c-0deeb98ffd62',
              formTemplateId: 'formTemplateId'
            },
            {
              name: 'Signature Field 2',
              order: 1,
              signerPositionId: 'd7c0be9d-4179-4ad2-a04a-37d3f2ad137c',
              formTemplateId: 'formTemplateId'
            }
          ]
        },
      ];
    })
  })
});
