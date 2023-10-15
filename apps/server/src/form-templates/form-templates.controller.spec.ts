import { Test, TestingModule } from '@nestjs/testing';
import { FormTemplatesController } from './form-templates.controller';
import { FormTemplatesService } from './form-templates.service';
import { PrismaService } from './../../../server/src/prisma/prisma.service';

describe('FormTemplatesController', () => {
  let controller: FormTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormTemplatesController],
      providers: [FormTemplatesService, PrismaService],
    }).compile();

    controller = module.get<FormTemplatesController>(FormTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of form templates', async () => {
      const result = [
        {
          id: 'e975f200-cca7-4f47-9139-41ad743ba159',
          name: 'Form Template 1',
          formDocLink: 'formtemplate1.pdf',
          createdAt: new Date(1672531200),
          updatedAt: new Date(1672531200),
          signatureFields: [],
          formInstances: [],
        },
        {
          id: '00f1becf-4348-4680-a6d7-374af5c39d75',
          name: 'Form Template 2',
          formDocLink: 'formtemplate2.pdf',
          createdAt: new Date(1672531200),
          updatedAt: new Date(1672531200),
          signatureFields: [],
          formInstances: [],
        },
      ];
    });
  });
});
