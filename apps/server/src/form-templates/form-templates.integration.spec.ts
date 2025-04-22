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
  let departmentsService: DepartmentsService;
  let positionsService: PositionsService;
  let employeesService: EmployeesService;
  let pdfStoreService: PdfStoreService;

  let departmentId: string | undefined;
  let positionId1: string | undefined;
  let employeeId1: string | undefined;
  let formTemplate1: FormTemplateEntity | undefined;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        FormTemplatesService,
        EmployeesService,
        PositionsService,
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
      ],
    }).compile();

    service = module.get<FormTemplatesService>(FormTemplatesService);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    positionsService = module.get<PositionsService>(PositionsService);
    employeesService = module.get<EmployeesService>(EmployeesService);
    pdfStoreService = module.get<PdfStoreService>(PdfStoreService);
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
      ).rejects.toThrowError(
        'Form template with name "Form Template 1" already exists.',
      );
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
      const formTemplates = await service.findAll();

      expect(formTemplates).toHaveLength(10);
    });

    it('successfully retrieves all form templates with limit', async () => {
      const formTemplatesPage1 = await service.findAll(0);
      const formTemplatesPage2 = await service.findAll(1);

      expect(formTemplatesPage1).toHaveLength(8);
      expect(formTemplatesPage2).toHaveLength(2);
    });

    it('does not include disabled templates', async () => {
      const formTemplate3 = await service.create({
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
      const formTemplates: FormTemplateEntity[] = await service.findAll();
      expect(
        formTemplates.some((template) => template.id === formTemplate3.id),
      ).toBe(true);
      await service.update(formTemplate3.id, {
        disabled: true,
      });
      const formTemplatesAfter: FormTemplateEntity[] = await service.findAll();
      expect(
        formTemplatesAfter.some((template) => template.id === formTemplate3.id),
      ).toBe(false);
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
    });

    it('successfully updates a form template', async () => {
      const updatedFormTemplate = await service.update(formTemplate1!.id, {
        name: 'Updated Form Template',
        description: 'Updated Form Template Description',
      });

      expect(updatedFormTemplate).toBeDefined();
      expect(updatedFormTemplate.name).toBe('Updated Form Template');
      expect(updatedFormTemplate.description).toBe(
        'Updated Form Template Description',
      );
      // field groups are not updated
      expect(updatedFormTemplate.fieldGroups).toEqual(
        formTemplate1?.fieldGroups,
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
      ).rejects.toThrowError(
        'Form template with name "Form Template 2" already exists.',
      );
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

      const formTemplates = await service.findAll();
      expect(formTemplates).toHaveLength(1);
      expect(updatedFormTemplate.disabled).toEqual(true);
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

      const formTemplates = await service.findAll();
      expect(formTemplates).toHaveLength(0);
    });
  });
});
