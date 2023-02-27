import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from '../models/form.entity';
import { CreateFormDto, FormDto } from './form.dto';
import { FormService } from './form.service';

describe('FormService', () => {
  // Instantiate formService and formRepository
  let formService: FormService;
  let formRepository: Repository<Form>;
  const FORM_REPOSITORY_TOKEN = getRepositoryToken(Form);

  beforeEach(async () => {
    // Mocking the FormService and TypeOrm methods used in FormService
    const moduleRef = await Test.createTestingModule({
      providers: [
        FormService,
        {
          provide: FORM_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn((entity: FormDto): Form => {
              const form: Form = {
                id: 0,
                name: entity.name,
                signatureChainLinkHead: null,
                signatureChainLinkHeadId: 0,
                formInstances: [],
              };
              return form;
            }),
            save: jest.fn((entity) => entity),
          },
        },
      ],
    }).compile();

    // Initialize the formService and formRepository with the mock values
    formService = moduleRef.get<FormService>(FormService);
    formRepository = moduleRef.get<Repository<Form>>(FORM_REPOSITORY_TOKEN);
  });

  it('formService should be defined', () => {
    expect(formService).toBeDefined();
  });

  it('formRepository should be defined', () => {
    expect(formRepository).toBeDefined();
  });

  describe('Tests creating a form', () => {
    let createFormDto: CreateFormDto;
    let createdForm: Form;

    beforeAll(() => {
      createFormDto = {
        name: 'form1',
        pdfLink: 'https://www.sandboxnu.com/',
      };
    });

    beforeEach(async () => {
      createdForm = await formService.createForm(createFormDto);
    });

    it('should call formRepository.create', () => {
      const formDto: FormDto = {
        name: createFormDto.name,
        pdfLink: createFormDto.pdfLink,
        signatureChainLinkHead: null,
        formInstances: [],
      };
      expect(formRepository.create).toHaveBeenCalledWith(formDto);
    });

    it('should call formRepository.save', () => {
      const createForm: Form = {
        id: 0,
        name: createFormDto.name,
        signatureChainLinkHead: null,
        signatureChainLinkHeadId: 0,
        formInstances: [],
      };
      expect(formRepository.save).toHaveBeenCalledWith(createForm);
    });

    it('should return the created form', () => {
      expect(createdForm.id).toBe(0);
      expect(createdForm.name).toBe(createFormDto.name);
      expect(createdForm.signatureChainLinkHead).toBe(null);
      expect(createdForm.signatureChainLinkHeadId).toBe(0);
      expect(createdForm.formInstances).toStrictEqual([]);
    });
  });
});
