import { TestingModule, Test } from '@nestjs/testing';
import { DepartmentsService } from '../departments/departments.service';
import { EmployeesService } from '../employees/employees.service';
import { PositionsService } from '../positions/positions.service';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums } from '@prisma/client';
import { FormInstancesService } from './form-instances.service';
import { PostmarkService } from '../postmark/postmark.service';
import { PdfStoreService } from '../pdf-store/pdf-store.service';
import { FormTemplatesService } from '../form-templates/form-templates.service';
import { MockFileStorageHandler } from '../pdf-store/file-storage/MockFileStorageHandler';
import { Readable } from 'stream';
import { FormTemplateEntity } from '../form-templates/entities/form-template.entity';
import MockEmailHandler from '../postmark/MockEmailHandler';
import { FormInstanceEntity } from './entities/form-instance.entity';
import { MockValidateEmployeeHandler } from '../employees/validate-employee/MockValidateEmployeeHandler';

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

describe('FormInstancesIntegrationTest', () => {
  let module: TestingModule;
  let service: FormInstancesService;
  let departmentsService: DepartmentsService;
  let positionsService: PositionsService;
  let employeesService: EmployeesService;
  let formTemplatesService: FormTemplatesService;
  let postmarkService: PostmarkService;
  let pdfStoreService: PdfStoreService;

  let departmentId: string;
  let departmentId2: string;
  let positionId1: string;
  let positionId2: string;
  let employeeId1: string;
  let employeeId2: string;
  let formTemplate1: FormTemplateEntity;
  let formTemplate2: FormTemplateEntity;
  let formInstance1: FormInstanceEntity;
  let formInstance2: FormInstanceEntity;

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

    service = module.get<FormInstancesService>(FormInstancesService);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    positionsService = module.get<PositionsService>(PositionsService);
    employeesService = module.get<EmployeesService>(EmployeesService);
    formTemplatesService =
      module.get<FormTemplatesService>(FormTemplatesService);
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
    // We need to seed the database with some data
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
        module.get<PrismaService>(PrismaService).position.deleteMany(),
        module.get<PrismaService>(PrismaService).department.deleteMany(),
      ]);

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
        accessToken: '123456',
      })
    ).id;
    employeeId2 = (
      await employeesService.create({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password',
        scope: $Enums.EmployeeScope.BASE_USER,
        accessToken: '123456',
      })
    ).id;
    await employeesService.update(employeeId1, {
      positionId: positionId1,
    });
    formTemplate1 = await formTemplatesService.create({
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
    formTemplate2 = await formTemplatesService.create({
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
        {
          name: 'Field Group 2',
          order: 1,
          templateBoxes: [
            {
              type: $Enums.SignatureBoxFieldType.SIGNATURE,
              x_coordinate: 0,
              y_coordinate: 0,
            },
          ],
        },
      ],
    });
  });

  describe('checkValidAssignedGroupsSigner', () => {
    describe('user signer type', () => {
      it('should return if the user is a valid employee', async () => {
        expect(
          await service.checkValidAssignedGroupsSigner([
            {
              order: 0,
              fieldGroupId: 'fieldGroupId',
              signerType: $Enums.SignerType.USER,
              signerEmployeeId: employeeId1,
              signerEmployeeList: [],
            },
          ]),
        ).toBe(true);
      });

      it('should raise an error if the user is not a valid employee', async () => {
        await expect(
          service.checkValidAssignedGroupsSigner([
            {
              order: 0,
              fieldGroupId: 'fieldGroupId',
              signerType: $Enums.SignerType.USER,
              signerEmployeeId: 'invalidEmployeeId',
              signerEmployeeList: [],
            },
          ]),
        ).rejects.toThrowError();
      });
    });

    describe('department signer type', () => {
      it('should return if the department is a valid department', async () => {
        expect(
          await service.checkValidAssignedGroupsSigner([
            {
              order: 0,
              fieldGroupId: 'fieldGroupId',
              signerType: $Enums.SignerType.DEPARTMENT,
              signerDepartmentId: departmentId,
              signerEmployeeList: [],
            },
          ]),
        ).toBe(true);
      });

      it('should raise an error if the department is not a valid department', async () => {
        await expect(
          service.checkValidAssignedGroupsSigner([
            {
              order: 0,
              fieldGroupId: 'fieldGroupId',
              signerType: $Enums.SignerType.DEPARTMENT,
              signerDepartmentId: 'invalidDepartmentId',
              signerEmployeeList: [],
            },
          ]),
        ).rejects.toThrowError();
      });
    });

    describe('position signer type', () => {
      it('should return if the position is a valid position', async () => {
        expect(
          await service.checkValidAssignedGroupsSigner([
            {
              order: 0,
              fieldGroupId: 'fieldGroupId',
              signerType: $Enums.SignerType.POSITION,
              signerPositionId: positionId1,
              signerEmployeeList: [],
            },
          ]),
        ).toBe(true);
      });

      it('should raise an error if the position is not a valid position', async () => {
        await expect(
          service.checkValidAssignedGroupsSigner([
            {
              order: 0,
              fieldGroupId: 'fieldGroupId',
              signerType: $Enums.SignerType.POSITION,
              signerPositionId: 'invalidPositionId',
              signerEmployeeList: [],
            },
          ]),
        ).rejects.toThrowError();
      });
    });

    describe('employee list signer type', () => {
      it('should return if the employee list is a valid employee list', async () => {
        expect(
          await service.checkValidAssignedGroupsSigner([
            {
              order: 0,
              fieldGroupId: 'fieldGroupId',
              signerType: $Enums.SignerType.USER_LIST,
              signerEmployeeList: [{ id: employeeId1 }],
            },
          ]),
        ).toBe(true);
      });

      it('should return if the employee list is a valid employee list, multiple', async () => {
        expect(
          await service.checkValidAssignedGroupsSigner([
            {
              order: 0,
              fieldGroupId: 'fieldGroupId',
              signerType: $Enums.SignerType.USER_LIST,
              signerEmployeeList: [{ id: employeeId1 }, { id: employeeId2 }],
            },
          ]),
        ).toBe(true);
      });

      it('should raise an error if the employee list is not a valid employee list', async () => {
        await expect(
          service.checkValidAssignedGroupsSigner([
            {
              order: 0,
              fieldGroupId: 'fieldGroupId',
              signerType: $Enums.SignerType.USER_LIST,
              signerEmployeeList: [
                { id: 'invalidEmployeeId' },
                { id: employeeId2 },
              ],
            },
          ]),
        ).rejects.toThrowError();
      });
    });
  });

  describe('create', () => {
    it('should create a new form instance', async () => {
      const formInstance = await service.create({
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
        originatorId: employeeId1,
        formTemplateId: formTemplate1.id,
        formDocLink: 'formDocLink',
        description: 'description',
      });

      expect(formInstance).toBeDefined();
      expect(formInstance.id).toBeDefined();
      expect(formInstance.name).toBe('Form Instance');
      expect(formInstance.assignedGroups).toHaveLength(1);
      expect(formInstance.assignedGroups[0].order).toBe(0);
      expect(formInstance.assignedGroups[0].fieldGroupId).toBe(
        formTemplate1.fieldGroups[0].id,
      );
      expect(formInstance.assignedGroups[0].signerType).toBe(
        $Enums.SignerType.USER,
      );
      expect(formInstance.assignedGroups[0].signerEmployeeId).toBe(employeeId1);
      expect(formInstance.originatorId).toBe(employeeId1);
      expect(formInstance.formTemplateId).toBe(formTemplate1.id);
      expect(formInstance.formDocLink).toBe('formDocLink');
      expect(formInstance.description).toBe('description');
      expect(formInstance.markedCompleted).toBe(false);
      expect(formInstance.originator.id).toBe(employeeId1);

      expect(postmarkService.sendFormCreatedEmail).toBeCalledWith(
        'john.doe@example.com',
        'John Doe',
        'Form Instance',
      );
    });

    it('should fail if template does not exist', async () => {
      await expect(
        service.create({
          name: 'Form Instance',
          assignedGroups: [
            {
              order: 0,
              fieldGroupId: 'fieldGroupId',
              signerType: $Enums.SignerType.USER,
              signerEmployeeId: employeeId1,
              signerEmployeeList: [],
            },
          ],
          originatorId: employeeId1,
          formTemplateId: 'invalidFormTemplateId',
          formDocLink: 'formDocLink',
          description: 'description',
        }),
      ).rejects.toThrowError('Form template could not be found with this id');
    });

    it('should fail if number of assigned groups does not match number of template groups', async () => {
      await expect(
        service.create({
          name: 'Form Instance',
          assignedGroups: [],
          originatorId: employeeId1,
          formTemplateId: formTemplate1.id,
          formDocLink: 'formDocLink',
          description: 'description',
        }),
      ).rejects.toThrowError('Invalid number of assigned groups specified');
    });

    it('should fail if assigned groups have invalid assignees', async () => {
      await expect(
        service.create({
          name: 'Form Instance',
          assignedGroups: [
            {
              order: 0,
              fieldGroupId: formTemplate1.fieldGroups[0].id,
              signerType: $Enums.SignerType.USER,
              signerEmployeeId: 'invalidEmployeeId',
              signerEmployeeList: [],
            },
          ],
          originatorId: employeeId1,
          formTemplateId: formTemplate1.id,
          formDocLink: 'formDocLink',
          description: 'description',
        }),
      ).rejects.toThrowError('Employee could not be found with this email');
    });
  });

  describe('findAssignedTo', () => {
    describe('by position', () => {
      beforeEach(async () => {
        formInstance1 = await service.create({
          name: 'Form Instance',
          assignedGroups: [
            {
              order: 0,
              fieldGroupId: formTemplate1.fieldGroups[0].id,
              signerType: $Enums.SignerType.POSITION,
              signerPositionId: positionId1,
              signerEmployeeList: [],
            },
          ],
          originatorId: employeeId1,
          formTemplateId: formTemplate1.id,
          formDocLink: 'formDocLink',
          description: 'description',
        });
      });

      it("should find form instances assigned to a user's position", async () => {
        const formInstances = await service.findAssignedTo(employeeId1);

        expect(formInstances).toHaveLength(1);
        expect(formInstances[0].id).toBe(formInstance1.id);
      });
    });
    describe('by department', () => {
      beforeEach(async () => {
        formInstance1 = await service.create({
          name: 'Form Instance',
          assignedGroups: [
            {
              order: 0,
              fieldGroupId: formTemplate1.fieldGroups[0].id,
              signerType: $Enums.SignerType.DEPARTMENT,
              signerDepartmentId: departmentId,
              signerEmployeeList: [],
            },
          ],
          originatorId: employeeId1,
          formTemplateId: formTemplate1.id,
          formDocLink: 'formDocLink',
          description: 'description',
        });
      });

      it("should find form instances assigned to a user's department", async () => {
        const formInstances = await service.findAssignedTo(employeeId1);

        expect(formInstances).toHaveLength(1);
        expect(formInstances[0].id).toBe(formInstance1.id);
      });
    });
    describe('by user', () => {
      beforeEach(async () => {
        formInstance1 = await service.create({
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
          originatorId: employeeId1,
          formTemplateId: formTemplate1.id,
          formDocLink: 'formDocLink',
          description: 'description',
        });
      });

      it("should find form instances assigned to a user's position", async () => {
        const formInstances = await service.findAssignedTo(employeeId1);

        expect(formInstances).toHaveLength(1);
        expect(formInstances[0].id).toBe(formInstance1.id);
      });
    });
    describe('by user list', () => {
      beforeEach(async () => {
        formInstance1 = await service.create({
          name: 'Form Instance',
          assignedGroups: [
            {
              order: 0,
              fieldGroupId: formTemplate1.fieldGroups[0].id,
              signerType: $Enums.SignerType.USER_LIST,
              signerEmployeeList: [{ id: employeeId1 }],
            },
          ],
          originatorId: employeeId1,
          formTemplateId: formTemplate1.id,
          formDocLink: 'formDocLink',
          description: 'description',
        });
      });

      it("should find form instances assigned to a user's position", async () => {
        const formInstances = await service.findAssignedTo(employeeId1);

        expect(formInstances).toHaveLength(1);
        expect(formInstances[0].id).toBe(formInstance1.id);
      });
    });
    describe('fails', () => {
      it('should fail if the employee does not exist', async () => {
        await expect(
          service.findAssignedTo('invalidEmployeeId'),
        ).rejects.toThrow('Employee could not be found with this email');
      });
      it('should fail if the employee does not have a position', async () => {
        await expect(service.findAssignedTo(employeeId2)).rejects.toThrow(
          'Employee has not been onboarded',
        );
      });
    });
  });

  describe('findCreatedBy', () => {
    beforeEach(async () => {
      formInstance1 = await service.create({
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
        originatorId: employeeId2,
        formTemplateId: formTemplate1.id,
        formDocLink: 'formDocLink',
        description: 'description',
      });
    });

    it('should find form instances created by a user', async () => {
      const formInstances = await service.findCreatedBy(employeeId2);

      expect(formInstances).toHaveLength(1);
      expect(formInstances[0].id).toBe(formInstance1.id);
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      formInstance1 = await service.create({
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
        originatorId: employeeId1,
        formTemplateId: formTemplate1.id,
        formDocLink: 'formDocLink',
        description: 'description',
      });
      formInstance2 = await service.create({
        name: 'Form Instance 2',
        assignedGroups: [
          {
            order: 0,
            signerType: $Enums.SignerType.USER,
            fieldGroupId: formTemplate1.fieldGroups[0].id,
            signerEmployeeList: [],
            signerEmployeeId: employeeId1,
          },
        ],
        originatorId: employeeId1,
        formTemplateId: formTemplate1.id,
        formDocLink: 'formDocLink',
        description: 'description',
      });
    });

    it('should find all form instances', async () => {
      const formInstances = await service.findAll();

      expect(formInstances).toHaveLength(2);
      expect(formInstances[0].id).toBe(formInstance1.id);
      expect(formInstances[1].id).toBe(formInstance2.id);
    });
    it('should limit the number of form instances returned', async () => {
      const formInstances = await service.findAll(1);

      expect(formInstances).toHaveLength(1);
    });
  });
  describe('findOne', () => {
    beforeEach(async () => {
      formInstance1 = await service.create({
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
        originatorId: employeeId1,
        formTemplateId: formTemplate1.id,
        formDocLink: 'formDocLink',
        description: 'description',
      });
    });

    it('should find a form instance by id', async () => {
      const formInstance = await service.findOne(formInstance1.id);

      expect(formInstance).toBeDefined();
      expect(formInstance!.id).toBe(formInstance1.id);
    });
    it('should fail if the form instance does not exist', async () => {
      await expect(
        service.findOne('3f2c1a8e-9b4f-4d7a-8f6e-2a9d3c7b5e1f'),
      ).rejects.toThrow('No FormInstance found');
    });
  });
  describe('update', () => {
    beforeEach(async () => {
      formInstance1 = await service.create({
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
        originatorId: employeeId1,
        formTemplateId: formTemplate1.id,
        formDocLink: 'formDocLink',
        description: 'description',
      });
    });

    it('should update a form instance', async () => {
      const formInstance = await service.update(formInstance1.id, {
        name: 'Updated Form Instance',
        formDocLink: 'link',
      });

      expect(formInstance).toBeDefined();
      expect(formInstance.id).toBe(formInstance1.id);
      expect(formInstance.name).toBe('Updated Form Instance');
      expect(formInstance.formDocLink).toBe('link');
    });
    it('should fail if the form instance does not exist', async () => {
      await expect(
        service.update('3f2c1a8e-9b4f-4d7a-8f6e-2a9d3c7b5e1f', {
          name: 'Updated Form Instance',
          description: 'Updated description',
        }),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    beforeEach(async () => {
      formInstance1 = await service.create({
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
        originatorId: employeeId1,
        formTemplateId: formTemplate1.id,
        formDocLink: 'formDocLink',
        description: 'description',
      });
    });

    it('should remove a form instance', async () => {
      await service.remove(formInstance1.id);

      await expect(service.findOne(formInstance1.id)).rejects.toThrow();
    });
    it('should fail if the form instance does not exist', async () => {
      await expect(
        service.remove('3f2c1a8e-9b4f-4d7a-8f6e-2a9d3c7b5e1f'),
      ).rejects.toThrow();
    });
  });

  describe('signFormInstance', () => {
    // need to create some mock instances with two assigned groups
    beforeEach(async () => {
      formInstance1 = await service.create({
        name: 'Form Instance',
        assignedGroups: [
          {
            order: 0,
            fieldGroupId: formTemplate2.fieldGroups[0].id,
            signerType: $Enums.SignerType.USER,
            signerEmployeeId: employeeId1,
            signerEmployeeList: [],
          },
        ],
        originatorId: employeeId1,
        formTemplateId: formTemplate1.id,
        formDocLink: 'formDocLink',
        description: 'description',
      });
      formInstance2 = await service.create({
        name: 'Form Instance 2',
        assignedGroups: [
          {
            order: 0,
            fieldGroupId: formTemplate2.fieldGroups[0].id,
            signerType: $Enums.SignerType.USER,
            signerEmployeeId: employeeId1,
            signerEmployeeList: [],
          },
          {
            order: 1,
            fieldGroupId: formTemplate2.fieldGroups[1].id,
            signerType: $Enums.SignerType.POSITION,
            signerPositionId: positionId2,
            signerEmployeeList: [],
          },
        ],
        originatorId: employeeId2,
        formTemplateId: formTemplate2.id,
        formDocLink: 'formDocLink',
        description: 'description',
      });
    });

    it('should sign a form instance', async () => {
      await service.signFormInstance(
        formInstance2.id,
        formInstance2.assignedGroups.sort((a, b) => a.order - b.order)[0].id,
        {
          id: employeeId1,
          email: 'john.doe@example.com',
        },
        {
          file: emptyFile,
        },
      );

      const formInstance = await service.findOne(formInstance2.id);
      expect(formInstance).toBeDefined();
      expect(formInstance!.markedCompleted).toBe(false);
      expect(
        formInstance!.assignedGroups.sort((a, b) => a.order - b.order)[0]
          .signed,
      ).toBe(true);
      expect(
        formInstance!.assignedGroups.sort((a, b) => a.order - b.order)[0]
          .signerEmployeeId,
      ).toBe(employeeId1);

      expect(
        postmarkService.sendReadyForSignatureToPositionEmail,
      ).toBeCalledWith(positionId2, 'Form Instance 2');
      expect(postmarkService.sendSignedEmail).toBeCalledWith(
        'jane.doe@example.com',
        'Jane Doe',
        'John Doe',
        'Form Instance 2',
      );
      expect(pdfStoreService.uploadPdf).toBeCalledWith(
        emptyFile.buffer,
        `${formInstance2.id}-${
          formInstance2.assignedGroups.sort((a, b) => a.order - b.order)[0].id
        }-${employeeId1}`,
      );
    });

    describe('all signed', () => {
      it('should mark the form as all signed when ready', async () => {
        await service.signFormInstance(
          formInstance1.id,
          formInstance1.assignedGroups.sort((a, b) => a.order - b.order)[0].id,
          {
            id: employeeId1,
            email: 'john.doe@example.com',
          },
          {
            file: emptyFile,
          },
        );

        const formInstance = await service.findOne(formInstance1.id);
        expect(formInstance).toBeDefined();
        expect(formInstance.completed).toBe(true);
      });
    });

    describe('error', () => {
      it('should fail if the form instance does not exist', async () => {
        expect(
          service.signFormInstance(
            '3f2c1a8e-9b4f-4d7a-8f6e-2a9d3c7b5e1f',
            formInstance2.assignedGroups.sort((a, b) => a.order - b.order)[0]
              .id,
            {
              id: employeeId1,
              email: 'john.doe@example.com',
            },
            {
              file: emptyFile,
            },
          ),
        ).rejects.toThrow('No FormInstance found');
      });

      it('should fail if employee is not onboarded', async () => {
        await module.get<PrismaService>(PrismaService).employee.update({
          where: {
            id: employeeId1,
          },
          data: {
            positionId: null,
          },
        });

        expect(
          service.signFormInstance(
            formInstance2.id,
            formInstance2.assignedGroups.sort((a, b) => a.order - b.order)[0]
              .id,
            {
              id: employeeId1,
              email: 'john.doe@example.com',
            },
            {
              file: emptyFile,
            },
          ),
        ).rejects.toThrow('Employee has not been onboarded');
      });

      it('should fail if the assigned group does not exist', async () => {
        await expect(
          service.signFormInstance(
            formInstance2.id,
            'invalidAssignedGroupId',
            {
              id: employeeId1,
              email: 'john.doe@example.com',
            },
            {
              file: emptyFile,
            },
          ),
        ).rejects.toThrow('Assigned group could not be found');
      });

      it('should fail if assigned group is not next to be signed', async () => {
        await employeesService.update(employeeId2, { positionId: positionId2 });

        await expect(
          service.signFormInstance(
            formInstance2.id,
            formInstance2.assignedGroups.sort((a, b) => a.order - b.order)[1]
              .id,
            {
              id: employeeId2,
              email: 'jane.doe@example.com',
            },
            {
              file: emptyFile,
            },
          ),
        ).rejects.toThrow('Assigned group is not the next one to be signed');
      });

      it('should fail if employee is not the assigned signer, position', async () => {
        formInstance2 = await service.create({
          name: 'Form Instance 2',
          assignedGroups: [
            {
              order: 0,
              fieldGroupId: formTemplate2.fieldGroups[0].id,
              signerType: $Enums.SignerType.POSITION,
              signerPositionId: positionId1,
              signerEmployeeList: [],
            },
            {
              order: 1,
              fieldGroupId: formTemplate2.fieldGroups[1].id,
              signerType: $Enums.SignerType.POSITION,
              signerPositionId: positionId2,
              signerEmployeeList: [],
            },
          ],
          originatorId: employeeId2,
          formTemplateId: formTemplate2.id,
          formDocLink: 'formDocLink',
          description: 'description',
        });
        await employeesService.update(employeeId2, { positionId: positionId2 });

        await expect(
          service.signFormInstance(
            formInstance2.id,
            formInstance2.assignedGroups.sort((a, b) => a.order - b.order)[0]
              .id,
            {
              id: employeeId2,
              email: 'jane.doe@example.com',
            },
            {
              file: emptyFile,
            },
          ),
        ).rejects.toThrow('Employee cannot sign for this Assigned group');
      });

      it('should fail if employee is not the assigned signer, department', async () => {
        formInstance2 = await service.create({
          name: 'Form Instance 2',
          assignedGroups: [
            {
              order: 0,
              fieldGroupId: formTemplate2.fieldGroups[0].id,
              signerType: $Enums.SignerType.DEPARTMENT,
              signerDepartmentId: departmentId2,
              signerEmployeeList: [],
            },
            {
              order: 1,
              fieldGroupId: formTemplate2.fieldGroups[1].id,
              signerType: $Enums.SignerType.POSITION,
              signerPositionId: positionId2,
              signerEmployeeList: [],
            },
          ],
          originatorId: employeeId2,
          formTemplateId: formTemplate2.id,
          formDocLink: 'formDocLink',
          description: 'description',
        });

        await expect(
          service.signFormInstance(
            formInstance2.id,
            formInstance2.assignedGroups.sort((a, b) => a.order - b.order)[0]
              .id,
            {
              id: employeeId1,
              email: 'john.doe@example.com',
            },
            {
              file: emptyFile,
            },
          ),
        ).rejects.toThrow('Employee cannot sign for this Assigned group');
      });

      it('should fail if employee is not the assigned signer, user list', async () => {
        formInstance2 = await service.create({
          name: 'Form Instance 2',
          assignedGroups: [
            {
              order: 0,
              fieldGroupId: formTemplate2.fieldGroups[0].id,
              signerType: $Enums.SignerType.USER_LIST,
              signerEmployeeList: [{ id: employeeId2 }],
            },
            {
              order: 1,
              fieldGroupId: formTemplate2.fieldGroups[1].id,
              signerType: $Enums.SignerType.POSITION,
              signerPositionId: positionId2,
              signerEmployeeList: [],
            },
          ],
          originatorId: employeeId2,
          formTemplateId: formTemplate2.id,
          formDocLink: 'formDocLink',
          description: 'description',
        });

        await expect(
          service.signFormInstance(
            formInstance2.id,
            formInstance2.assignedGroups.sort((a, b) => a.order - b.order)[0]
              .id,
            {
              id: employeeId1,
              email: 'john.doe@example.com',
            },
            {
              file: emptyFile,
            },
          ),
        ).rejects.toThrow('Employee cannot sign for this Assigned group');
      });
    });
  });

  describe('markFormInstanceAsCompleted', () => {
    beforeEach(async () => {
      formInstance1 = await service.create({
        name: 'Form Instance',
        assignedGroups: [
          {
            order: 0,
            fieldGroupId: formTemplate2.fieldGroups[0].id,
            signerType: $Enums.SignerType.USER,
            signerEmployeeId: employeeId1,
            signerEmployeeList: [],
          },
        ],
        originatorId: employeeId1,
        formTemplateId: formTemplate1.id,
        formDocLink: 'formDocLink',
        description: 'description',
      });
      await service.signFormInstance(
        formInstance1.id,
        formInstance1.assignedGroups.sort((a, b) => a.order - b.order)[0].id,
        {
          id: employeeId1,
          email: 'john.doe@example.com',
        },
        {
          file: emptyFile,
        },
      );
    });

    it('should mark a form instance as completed', async () => {
      await service.markFormInstanceAsCompleted(employeeId1, formInstance1.id);

      const formInstance = await service.findOne(formInstance1.id);
      expect(formInstance).toBeDefined();
      expect(formInstance!.markedCompleted).toBe(true);
    });

    it('should fail if form instance is not found', async () => {
      await expect(
        service.markFormInstanceAsCompleted(
          employeeId1,
          'invalidFormInstanceId',
        ),
      ).rejects.toThrow();
    });

    it('should fail if employee is not the originator', async () => {
      await expect(
        service.markFormInstanceAsCompleted(employeeId2, formInstance1.id),
      ).rejects.toThrow();
    });
  });
});
