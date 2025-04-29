import { TestingModule, Test } from '@nestjs/testing';
import { $Enums } from '@prisma/client';
import { DepartmentsService } from '../departments/departments.service';
import { EmployeesService } from '../employees/employees.service';
import { PdfStoreService } from '../pdf-store/pdf-store.service';
import { PositionsService } from '../positions/positions.service';
import { PrismaService } from '../prisma/prisma.service';
import { FormTemplateEntity } from './entities/form-template.entity';
import { FormTemplatesService } from './form-templates.service';
import { MockFileStorageHandler } from '../pdf-store/file-storage/MockFileStorageHandler';
import { Readable } from 'stream';
import { FormInstanceEntity } from '../form-instances/entities/form-instance.entity';
import { FormInstancesService } from '../form-instances/form-instances.service';
import { PostmarkService } from '../postmark/postmark.service';
import MockEmailHandler from '../postmark/MockEmailHandler';
import { MockValidateEmployeeHandler } from '../employees/validate-employee/MockValidateEmployeeHandler';
import { SortOption } from '../utils';

const emptyFile: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'form.pdf',
  encoding: '7bit',
  mimetype: 'application/pdf',
  buffer: Buffer.from([]),
  size: 0,
  stream: new Readable(),
  destination: '',
  filename: '',
  path: '',
};

describe('FormTemplatesIntegrationTest', () => {
  let module: TestingModule;
  let service: FormTemplatesService;
  let instanceService: FormInstancesService;
  let departmentsService: DepartmentsService;
  let positionsService: PositionsService;
  let employeesService: EmployeesService;
  let postmarkService: PostmarkService;
  let pdfStoreService: PdfStoreService;

  let departmentId: string | undefined;
  let positionId1: string | undefined;
  let employeeId1: string | undefined;
  let formTemplate1: FormTemplateEntity | undefined;
  let formInstance1: FormInstanceEntity | undefined;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        FormTemplatesService,
        FormInstancesService,
        EmployeesService,
        PositionsService,
        PostmarkService,
        DepartmentsService,
        PdfStoreService,
        PrismaService,
        {
          provide: 'FileStorageHandler',
          useClass: MockFileStorageHandler,
        },
        {
          provide: 'ValidateEmployeeHandler',
          useClass: MockFileStorageHandler,
        },

        {
          provide: 'EmailHandler',
          useClass: MockEmailHandler,
        },
        {
          provide: 'ValidateEmployeeHandler',
          useClass: MockValidateEmployeeHandler,
        },
      ],
    }).compile();

    service = module.get<FormTemplatesService>(FormTemplatesService);
    instanceService = module.get<FormInstancesService>(FormInstancesService);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    positionsService = module.get<PositionsService>(PositionsService);
    employeesService = module.get<EmployeesService>(EmployeesService);
    pdfStoreService = module.get<PdfStoreService>(PdfStoreService);
    jest.spyOn(pdfStoreService, 'uploadPdf').mockResolvedValue('pdfLink');
    postmarkService = module.get<PostmarkService>(PostmarkService);
    jest
      .spyOn(postmarkService, 'sendFormCreatedEmail')
      .mockResolvedValue(undefined);

    jest
      .spyOn(postmarkService, 'sendReadyForSignatureToPositionEmail')
      .mockResolvedValue(undefined);
    jest.spyOn(postmarkService, 'sendSignedEmail').mockResolvedValue(undefined);
    jest.spyOn(pdfStoreService, 'uploadPdf').mockResolvedValue('pdfLink');
  });

  beforeEach(async () => {
    // Clear the database
    await module
      .get<PrismaService>(PrismaService)
      .$transaction([
        module.get<PrismaService>(PrismaService).instanceBox.deleteMany(),
        module.get<PrismaService>(PrismaService).assignedGroup.deleteMany(),
        module.get<PrismaService>(PrismaService).formInstance.deleteMany(),
        module.get<PrismaService>(PrismaService).templateBox.deleteMany(),
        module.get<PrismaService>(PrismaService).fieldGroup.deleteMany(),
        module.get<PrismaService>(PrismaService).formTemplate.deleteMany(),
        module.get<PrismaService>(PrismaService).employee.deleteMany(),
        module.get<PrismaService>(PrismaService).department.deleteMany(),
        module.get<PrismaService>(PrismaService).position.deleteMany(),
      ]);

    // Seed the database
    departmentId = (await departmentsService.create({ name: 'Engineering' }))
      .id;
    positionId1 = (
      await positionsService.create({
        name: 'Software Engineer',
        departmentId,
      })
    ).id;
    employeeId1 = (
      await employeesService.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        scope: $Enums.EmployeeScope.ADMIN,
        accessToken: '123456',
      })
    ).id;
    await module.get<PrismaService>(PrismaService).employee.update({
      where: {
        id: employeeId1,
      },
      data: {
        position: {
          connect: {
            id: positionId1,
          },
        },
      },
    });
  });
  describe('create', () => {
    it('successfully creates a form template', async () => {
      const formTemplate = await service.create({
        name: 'Form Template',
        description: 'Form Template Description',
        file: emptyFile,
        pageWidth: 800,
        pageHeight: 1035,
        fieldGroups: [
          {
            name: 'Field Group',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
                width: 100,
                height: 100,
                page: 0,
              },
            ],
          },
        ],
        disabled: false,
      });

      expect(formTemplate).toBeDefined();
      expect(formTemplate.name).toBe('Form Template');
      expect(formTemplate.description).toBe('Form Template Description');
      expect(formTemplate.fieldGroups).toHaveLength(1);
      expect(formTemplate.fieldGroups[0].templateBoxes).toHaveLength(1);
      expect(formTemplate.fieldGroups[0].templateBoxes[0].type).toBe(
        $Enums.SignatureBoxFieldType.CHECKBOX,
      );
      expect(formTemplate.fieldGroups[0].templateBoxes[0].x_coordinate).toBe(0);
      expect(formTemplate.fieldGroups[0].templateBoxes[0].y_coordinate).toBe(0);
      expect(formTemplate.fieldGroups[0].order).toBe(0);
      expect(formTemplate.fieldGroups[0].name).toBe('Field Group');
      expect(formTemplate.formDocLink).toBe('pdfLink');
    });
    it('throws an error when creating a form template with an existing name', async () => {
      formTemplate1 = await service.create({
        name: 'Form Template 1',
        description: 'Form Template Description 1',
        file: emptyFile,
        pageWidth: 800,
        pageHeight: 1035,
        fieldGroups: [
          {
            name: 'Field Group 1',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
                width: 100,
                height: 100,
                page: 0,
              },
            ],
          },
        ],
        disabled: false,
      });

      await expect(
        service.create({
          name: 'Form Template 1',
          description: 'Form Template Description 1',
          file: emptyFile,
          pageWidth: 800,
          pageHeight: 1035,
          fieldGroups: [
            {
              name: 'Field Group 1',
              order: 0,
              templateBoxes: [
                {
                  type: $Enums.SignatureBoxFieldType.CHECKBOX,
                  x_coordinate: 0,
                  y_coordinate: 0,
                  width: 100,
                  height: 100,
                  page: 0,
                },
              ],
            },
          ],
          disabled: false,
        }),
      ).rejects.toThrowError('Form template with this name already exists');
    });
  });
  describe('findAll', () => {
    beforeEach(async () => {
      formTemplate1 = await service.create({
        name: 'Form Template 1',
        description: 'Form Template Description 1',
        file: emptyFile,
        pageWidth: 800,
        pageHeight: 1035,
        fieldGroups: [
          {
            name: 'Field Group 1',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
                width: 100,
                height: 100,
                page: 0,
              },
            ],
          },
        ],
        disabled: false,
      });
      await service.create({
        name: 'Form Template 2',
        description: 'Form Template Description 2',
        file: emptyFile,
        pageWidth: 800,
        pageHeight: 1035,
        fieldGroups: [
          {
            name: 'Field Group 2',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
                width: 100,
                height: 100,
                page: 0,
              },
            ],
          },
        ],
        disabled: false,
      });
      // Create the remaining 8 form instances in parallel
      await Promise.all(
        Array(8)
          .fill(0)
          .map((_, i) =>
            service.create({
              name: `Form Template ${i + 3}`,
              description: `Form Template Description ${i + 3}`,
              file: emptyFile,
              pageWidth: 800,
              pageHeight: 1035,
              fieldGroups: [
                {
                  name: 'Field Group 2',
                  order: 0,
                  templateBoxes: [
                    {
                      type: $Enums.SignatureBoxFieldType.CHECKBOX,
                      x_coordinate: 0,
                      y_coordinate: 0,
                      width: 100,
                      height: 100,
                      page: 0,
                    },
                  ],
                },
              ],
              disabled: false,
            }),
          ),
      );
    });

    it('successfully retrieves all form templates', async () => {
      const formTemplates = await service.findAll({});

      expect(formTemplates).toHaveLength(10);
    });

    it('successfully retrieves all form templates with limit', async () => {
      const formTemplatesPage1 = await service.findAll({ cursor: 0 });
      const formTemplatesPage2 = await service.findAll({ cursor: 1 });

      expect(formTemplatesPage1).toHaveLength(8);
      expect(formTemplatesPage2).toHaveLength(2);
    });

    it('does not include disabled templates', async () => {
      const formTemplate3 = await service.create({
        name: 'Form Template Disabled',
        description: 'Form Template Description Disabled',
        file: emptyFile,
        pageWidth: 800,
        pageHeight: 1035,
        fieldGroups: [
          {
            name: 'Field Group 2',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
                width: 100,
                height: 100,
                page: 0,
              },
            ],
          },
        ],
        disabled: false,
      });
      const formTemplates: FormTemplateEntity[] = await service.findAll({});
      expect(
        formTemplates.some((template) => template.id === formTemplate3.id),
      ).toBe(true);
      await service.update(formTemplate3.id, {
        disabled: true,
      });
      const formTemplatesAfter: FormTemplateEntity[] = await service.findAll(
        {},
      );
      expect(
        formTemplatesAfter.some((template) => template.id === formTemplate3.id),
      ).toBe(false);
    });

    describe('sorting', () => {
      it('sorts by name in ascending order', async () => {
        const formTemplates = await service.findAll({
          sortBy: SortOption.NAME_ASC,
        });

        expect(formTemplates).toHaveLength(10);
        expect(formTemplates[0].name).toBe('Form Template 1');
        expect(formTemplates[1].name).toBe('Form Template 10');
      });

      it('sorts by name in descending order', async () => {
        const formTemplates = await service.findAll({
          sortBy: SortOption.NAME_DESC,
        });

        expect(formTemplates).toHaveLength(10);
        expect(formTemplates[0].name).toBe('Form Template 9');
        expect(formTemplates[1].name).toBe('Form Template 8');
      });

      it('sorts by creation date in ascending order', async () => {
        const formTemplates = await service.findAll({
          sortBy: SortOption.CREATED_AT_ASC,
        });

        expect(formTemplates).toHaveLength(10);
        expect(formTemplates[0].createdAt.getUTCSeconds()).toBeLessThanOrEqual(
          formTemplates[1].createdAt.getUTCSeconds(),
        );
        expect(formTemplates[1].createdAt.getUTCSeconds()).toBeLessThanOrEqual(
          formTemplates[2].createdAt.getUTCSeconds(),
        );
      });

      it('sorts by creation date in descending order', async () => {
        const formTemplates = await service.findAll({
          sortBy: SortOption.CREATED_AT_DESC,
        });

        expect(formTemplates).toHaveLength(10);
        expect(
          formTemplates[0].createdAt.getUTCSeconds(),
        ).toBeGreaterThanOrEqual(formTemplates[1].createdAt.getUTCSeconds());
        expect(
          formTemplates[1].createdAt.getUTCSeconds(),
        ).toBeGreaterThanOrEqual(formTemplates[2].createdAt.getUTCSeconds());
      });

      it('sorts by updated date in ascending order', async () => {
        const formTemplates = await service.findAll({
          sortBy: SortOption.UPDATED_AT_ASC,
        });

        expect(formTemplates).toHaveLength(10);
        expect(formTemplates[0].updatedAt.getUTCSeconds()).toBeLessThanOrEqual(
          formTemplates[1].updatedAt.getUTCSeconds(),
        );
        expect(formTemplates[1].updatedAt.getUTCSeconds()).toBeLessThanOrEqual(
          formTemplates[2].updatedAt.getUTCSeconds(),
        );
      });

      it('sorts by updated date in descending order', async () => {
        const formTemplates = await service.findAll({
          sortBy: SortOption.UPDATED_AT_DESC,
        });

        expect(formTemplates).toHaveLength(10);
        expect(
          formTemplates[0].updatedAt.getUTCSeconds(),
        ).toBeGreaterThanOrEqual(formTemplates[1].updatedAt.getUTCSeconds());
        expect(
          formTemplates[1].updatedAt.getUTCSeconds(),
        ).toBeGreaterThanOrEqual(formTemplates[2].updatedAt.getUTCSeconds());
      });
    });
  });

  describe('findAllCount', () => {
    beforeEach(async () => {
      formTemplate1 = await service.create({
        name: 'Form Template 1',
        description: 'Form Template Description 1',
        file: emptyFile,
        pageWidth: 800,
        pageHeight: 1035,
        fieldGroups: [
          {
            name: 'Field Group 1',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
                width: 100,
                height: 100,
                page: 0,
              },
            ],
          },
        ],
        disabled: false,
      });
      await service.create({
        name: 'Form Template 2',
        description: 'Form Template Description 2',
        file: emptyFile,
        pageWidth: 800,
        pageHeight: 1035,
        fieldGroups: [
          {
            name: 'Field Group 2',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
                width: 100,
                height: 100,
                page: 0,
              },
            ],
          },
        ],
        disabled: true,
      });
    });

    it('successfully retrieves the count of all non-disabled form templates', async () => {
      const count = await service.findAllCount();
      expect(count).toBe(1);
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      formTemplate1 = await service.create({
        name: 'Form Template 1',
        description: 'Form Template Description 1',
        file: emptyFile,
        pageWidth: 800,
        pageHeight: 1035,
        fieldGroups: [
          {
            name: 'Field Group 1',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
                height: 100,
                width: 100,
                page: 0,
              },
            ],
          },
        ],
        disabled: false,
      });
    });

    it('successfully retrieves a form template', async () => {
      const formTemplate = await service.findOne(formTemplate1!.id);

      expect(formTemplate).toBeDefined();
      expect(formTemplate.name).toBe('Form Template 1');
      expect(formTemplate.description).toBe('Form Template Description 1');
    });

    it('throws an error when form template is not found', async () => {
      await expect(service.findOne('non-existent-id')).rejects.toThrowError();
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      formTemplate1 = await service.create({
        name: 'Form Template 1',
        description: 'Form Template Description 1',
        file: emptyFile,
        pageWidth: 800,
        pageHeight: 1035,
        fieldGroups: [
          {
            name: 'Field Group 1',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
                height: 100,
                width: 100,
                page: 0,
              },
            ],
          },
        ],
        disabled: false,
      });
      formInstance1 = await instanceService.create({
        name: 'Form Instance',
        assignedGroups: [
          {
            order: 0,
            fieldGroupId: formTemplate1.fieldGroups[0].id,
            signerType: $Enums.SignerType.USER,
            signerEmployeeId: employeeId1,
            signerEmployeeList: [],
          },
        ],
        originatorId: 'urn:uuid:' + employeeId1,
        formTemplateId: formTemplate1.id,
        formDocLink: 'formDocLink',
        description: 'description',
      });
    });

    it('successfully updates a form template', async () => {
      const updatedFormTemplate = await service.update(formTemplate1!.id, {
        name: 'Updated Form Template',
        description: 'Updated Form Template Description',
        fieldGroups: [
          {
            name: 'Field Group 1',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 10,
                y_coordinate: 10,
                width: 100,
                height: 100,
                page: 0,
              },
            ],
          },
          {
            name: 'Field Group 2',
            order: 1,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.TEXT_FIELD,
                x_coordinate: 47,
                y_coordinate: 28,
                width: 50,
                height: 100,
                page: 0,
              },
            ],
          },
        ],
      });

      expect(updatedFormTemplate).toBeDefined();
      expect(updatedFormTemplate.name).toBe('Updated Form Template');
      expect(updatedFormTemplate.description).toBe(
        'Updated Form Template Description',
      );
      // field groups are updated
      expect(updatedFormTemplate.fieldGroups).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Field Group 1',
            order: 0,
            templateBoxes: [
              expect.objectContaining({
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 10,
                y_coordinate: 10,
                width: 100,
                height: 100,
                page: 0,
              }),
            ],
          }),
          expect.objectContaining({
            name: 'Field Group 2',
            order: 1,
            templateBoxes: [
              expect.objectContaining({
                type: $Enums.SignatureBoxFieldType.TEXT_FIELD,
                x_coordinate: 47,
                y_coordinate: 28,
                width: 50,
                height: 100,
                page: 0,
              }),
            ],
          }),
        ]),
      );
    });

    it('throws an error when form template is not found', async () => {
      await expect(
        service.update('non-existent-id', {
          name: 'Updated Form Template',
          description: 'Updated Form Template Description',
        }),
      ).rejects.toThrowError();
    });

    it('throws an error when updating a form template with an existing name', async () => {
      await service.create({
        name: 'Form Template 2',
        description: 'Form Template Description 2',
        file: emptyFile,
        pageWidth: 800,
        pageHeight: 1035,
        fieldGroups: [
          {
            name: 'Field Group 2',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
                width: 100,
                height: 100,
                page: 0,
              },
            ],
          },
        ],
        disabled: false,
      });
      await expect(
        service.update(formTemplate1!.id, {
          name: 'Form Template 2',
          description: 'Updated Form Template Description',
        }),
      ).rejects.toThrowError('Form template with this name already exists');
    });

    it('successfully disables a form template', async () => {
      const templateToDisable = await service.create({
        name: 'Form Template To Disable',
        description: 'Form Template Description To Disable',
        file: emptyFile,
        pageWidth: 800,
        pageHeight: 1035,
        fieldGroups: [
          {
            name: 'Field Group 1',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
                width: 100,
                height: 100,
                page: 0,
              },
            ],
          },
        ],
        disabled: false,
      });
      const updatedFormTemplate = await service.update(templateToDisable!.id, {
        disabled: true,
      });

      const formTemplates = await service.findAll({});
      expect(formTemplates).toHaveLength(1);
      expect(updatedFormTemplate.disabled).toEqual(true);
    });

    it('does not modify existing form instances', async () => {
      await service.update(formTemplate1!.id, {
        name: 'Updated Form Template',
        description: 'Updated Form Template Description',
        fieldGroups: [
          {
            name: 'Field Group 1',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 10,
                y_coordinate: 10,
                width: 100,
                height: 100,
                page: 0,
              },
            ],
          },
          {
            name: 'Field Group 2',
            order: 1,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.TEXT_FIELD,
                x_coordinate: 47,
                y_coordinate: 28,
                width: 50,
                height: 100,
                page: 0,
              },
            ],
          },
        ],
      });
      expect(formInstance1?.assignedGroups).toHaveLength(1);
      expect(formInstance1?.formTemplateId).toBe(formTemplate1?.id);
      expect(formInstance1?.assignedGroups[0].fieldGroup).toEqual(
        expect.objectContaining({
          name: 'Field Group 1',
          order: 0,
          templateBoxes: [
            expect.objectContaining({
              type: $Enums.SignatureBoxFieldType.CHECKBOX,
              x_coordinate: 0,
              y_coordinate: 0,
              width: 100,
              height: 100,
              page: 0,
            }),
          ],
        }),
      );
    });
  });

  describe('remove', () => {
    it('successfully removes a form template', async () => {
      const templateToRemove = await service.create({
        name: 'Form Template To Remove',
        description: 'Form Template Description To Remove',
        file: emptyFile,
        pageWidth: 800,
        pageHeight: 1035,
        fieldGroups: [
          {
            name: 'Field Group 1',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
                width: 100,
                height: 100,
                page: 0,
              },
            ],
          },
        ],
        disabled: false,
      });

      await service.remove(templateToRemove.id);

      const formTemplates = await service.findAll({});
      expect(formTemplates).toHaveLength(0);
    });
  });

  // Add these tests to the existing form-templates.service.spec.ts file

  describe('FieldGroups Sorting Tests', () => {
    let formTemplateWithUnsortedGroups: FormTemplateEntity;

    beforeEach(async () => {
      // Create a form template with field groups in deliberately unsorted order
      formTemplateWithUnsortedGroups = await service.create({
        name: 'Form Template With Unsorted Groups',
        description: 'Form Template with field groups in unsorted order',
        file: emptyFile,
        pageWidth: 800,
        pageHeight: 1035,
        fieldGroups: [
          {
            name: 'Field Group 2',
            order: 1,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.SIGNATURE,
                x_coordinate: 0,
                y_coordinate: 0,
                width: 100,
                height: 100,
                page: 0,
              },
            ],
          },
          {
            name: 'Field Group 3',
            order: 2,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.TEXT_FIELD,
                x_coordinate: 0,
                y_coordinate: 0,
                width: 100,
                height: 100,
                page: 0,
              },
            ],
          },
          {
            name: 'Field Group 1',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
                width: 100,
                height: 100,
                page: 0,
              },
            ],
          },
        ],
        disabled: false,
      });
    });

    describe('findAll returns fieldGroups sorted by order', () => {
      it('should return field groups sorted by order in findAll results', async () => {
        const formTemplates = await service.findAll({});

        // Find the form template we created with unsorted groups
        const foundTemplate = formTemplates.find(
          (template) => template.id === formTemplateWithUnsortedGroups.id,
        );

        expect(foundTemplate).toBeDefined();

        // Check that field groups are sorted
        const fieldGroups = foundTemplate!.fieldGroups;
        expect(fieldGroups.length).toBe(3);

        // Check that they're in the right order
        expect(fieldGroups[0].order).toBe(0);
        expect(fieldGroups[1].order).toBe(1);
        expect(fieldGroups[2].order).toBe(2);

        // Verify the field group names match the expected order
        expect(fieldGroups[0].name).toBe('Field Group 1');
        expect(fieldGroups[1].name).toBe('Field Group 2');
        expect(fieldGroups[2].name).toBe('Field Group 3');
      });
    });

    describe('findOne returns fieldGroups sorted by order', () => {
      it('should return field groups sorted by order in findOne results', async () => {
        const foundTemplate = await service.findOne(
          formTemplateWithUnsortedGroups.id,
        );

        expect(foundTemplate).toBeDefined();

        // Check that field groups are sorted
        const fieldGroups = foundTemplate.fieldGroups;
        expect(fieldGroups.length).toBe(3);

        expect(fieldGroups[0].order).toBe(0);
        expect(fieldGroups[1].order).toBe(1);
        expect(fieldGroups[2].order).toBe(2);

        // Verify the field group names match the expected order
        expect(fieldGroups[0].name).toBe('Field Group 1');
        expect(fieldGroups[1].name).toBe('Field Group 2');
        expect(fieldGroups[2].name).toBe('Field Group 3');
      });
    });

    describe('create method preserves field group order when updating template', () => {
      it('should maintain field group order when updating a template with new data', async () => {
        // First verify our original template has field groups in the right order
        const originalTemplate = await service.findOne(
          formTemplateWithUnsortedGroups.id,
        );
        expect(originalTemplate.fieldGroups[0].order).toBe(0);
        expect(originalTemplate.fieldGroups[1].order).toBe(1);
        expect(originalTemplate.fieldGroups[2].order).toBe(2);

        // Now update the template with non-fieldGroup related data
        const updatedTemplate = await service.update(
          formTemplateWithUnsortedGroups.id,
          {
            name: 'Updated Template Name',
            description: 'Updated description',
          },
        );

        // Verify the field groups are still in the right order
        expect(updatedTemplate.fieldGroups.length).toBe(3);
        expect(updatedTemplate.fieldGroups[0].order).toBe(0);
        expect(updatedTemplate.fieldGroups[1].order).toBe(1);
        expect(updatedTemplate.fieldGroups[2].order).toBe(2);

        expect(updatedTemplate.fieldGroups[0].name).toBe('Field Group 1');
        expect(updatedTemplate.fieldGroups[1].name).toBe('Field Group 2');
        expect(updatedTemplate.fieldGroups[2].name).toBe('Field Group 3');
      });
    });

    describe('database persistence maintains field group order', () => {
      it('should maintain field group order across multiple find operations', async () => {
        // Find the template first time and check order
        const firstFind = await service.findOne(
          formTemplateWithUnsortedGroups.id,
        );
        expect(firstFind.fieldGroups[0].order).toBe(0);
        expect(firstFind.fieldGroups[1].order).toBe(1);
        expect(firstFind.fieldGroups[2].order).toBe(2);

        // Find through findAll
        const allTemplates = await service.findAll({});
        const templateFromAll = allTemplates.find(
          (t) => t.id === formTemplateWithUnsortedGroups.id,
        );
        expect(templateFromAll?.fieldGroups[0].order).toBe(0);
        expect(templateFromAll?.fieldGroups[1].order).toBe(1);
        expect(templateFromAll?.fieldGroups[2].order).toBe(2);

        // Find again through findOne to ensure consistency
        const secondFind = await service.findOne(
          formTemplateWithUnsortedGroups.id,
        );
        expect(secondFind.fieldGroups[0].order).toBe(0);
        expect(secondFind.fieldGroups[1].order).toBe(1);
        expect(secondFind.fieldGroups[2].order).toBe(2);
      });
    });
  });
});
