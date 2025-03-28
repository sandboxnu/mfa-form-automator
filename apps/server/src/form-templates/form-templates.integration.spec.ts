import { TestingModule, Test } from '@nestjs/testing';
import { $Enums } from '@prisma/client';
import { DepartmentsService } from '../departments/departments.service';
import { EmployeesService } from '../employees/employees.service';
import { FormInstancesService } from '../form-instances/form-instances.service';
import { PdfStoreService } from '../pdf-store/pdf-store.service';
import { PositionsService } from '../positions/positions.service';
import { PostmarkService } from '../postmark/postmark.service';
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
  let postmarkService: PostmarkService;
  let pdfStoreService: PdfStoreService;

  let departmentId: string | undefined;
  let departmentId2: string | undefined;
  let positionId1: string | undefined;
  let positionId2: string | undefined;
  let employeeId1: string | undefined;
  let employeeId2: string | undefined;
  let formTemplate1: FormTemplateEntity | undefined;
  let formTemplate2: FormTemplateEntity | undefined;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        FormInstancesService,
        FormTemplatesService,
        EmployeesService,
        PositionsService,
        DepartmentsService,
        PostmarkService,
        PdfStoreService,
        PrismaService,
        {
          provide: 'FileStorageHandler',
          useClass: MockFileStorageHandler,
        },
      ],
    }).compile();

    service = module.get<FormTemplatesService>(FormTemplatesService);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    positionsService = module.get<PositionsService>(PositionsService);
    employeesService = module.get<EmployeesService>(EmployeesService);
    postmarkService = module.get<PostmarkService>(PostmarkService);
    pdfStoreService = module.get<PdfStoreService>(PdfStoreService);
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
    departmentId2 = (await departmentsService.create({ name: 'HR' })).id;
    positionId1 = (
      await positionsService.create({
        name: 'Software Engineer',
        departmentId,
      })
    ).id;
    positionId2 = (
      await positionsService.create({
        name: 'QA Engineer',
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
      })
    ).id;
    employeeId2 = (
      await employeesService.create({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password',
        scope: $Enums.EmployeeScope.BASE_USER,
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
        fieldGroups: [
          {
            name: 'Field Group',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
              },
            ],
          },
        ],
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
      expect(formTemplate.formInstances).toHaveLength(0);
      expect(formTemplate.formDocLink).toBe('pdfLink');
    });
  });
  describe('findAll', () => {
    beforeEach(async () => {
      formTemplate1 = await service.create({
        name: 'Form Template 1',
        description: 'Form Template Description 1',
        file: emptyFile,
        fieldGroups: [
          {
            name: 'Field Group 1',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
              },
            ],
          },
        ],
      });
      formTemplate2 = await service.create({
        name: 'Form Template 2',
        description: 'Form Template Description 2',
        file: emptyFile,
        fieldGroups: [
          {
            name: 'Field Group 2',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
              },
            ],
          },
        ],
      });
    });

    it('successfully retrieves all form templates', async () => {
      const formTemplates = await service.findAll();

      expect(formTemplates).toHaveLength(2);
      expect(formTemplates[0].name).toBe('Form Template 1');
      expect(formTemplates[1].name).toBe('Form Template 2');
    });
    it('successfully retrieves all form templates with limit', async () => {
      const formTemplates = await service.findAll(1);

      expect(formTemplates).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      formTemplate1 = await service.create({
        name: 'Form Template 1',
        description: 'Form Template Description 1',
        file: emptyFile,
        fieldGroups: [
          {
            name: 'Field Group 1',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
              },
            ],
          },
        ],
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
        fieldGroups: [
          {
            name: 'Field Group 1',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
              },
            ],
          },
        ],
      });
    });

    it('successfully updates a form template', async () => {
      const updatedFormTemplate = await service.update(formTemplate1!.id, {
        name: 'Updated Form Template',
        description: 'Updated Form Template Description',
        file: emptyFile,
      });

      expect(updatedFormTemplate).toBeDefined();
      expect(updatedFormTemplate.name).toBe('Updated Form Template');
      expect(updatedFormTemplate.description).toBe(
        'Updated Form Template Description',
      );
    });

    it('throws an error when form template is not found', async () => {
      await expect(
        service.update('non-existent-id', {
          name: 'Updated Form Template',
          description: 'Updated Form Template Description',
          file: emptyFile,
        }),
      ).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('successfully removes a form template', async () => {
      formTemplate1 = await service.create({
        name: 'Form Template 1',
        description: 'Form Template Description 1',
        file: emptyFile,
        fieldGroups: [
          {
            name: 'Field Group 1',
            order: 0,
            templateBoxes: [
              {
                type: $Enums.SignatureBoxFieldType.CHECKBOX,
                x_coordinate: 0,
                y_coordinate: 0,
              },
            ],
          },
        ],
      });

      await service.remove(formTemplate1.id);

      const formTemplates = await service.findAll();
      expect(formTemplates).toHaveLength(0);
    });
  });
});
