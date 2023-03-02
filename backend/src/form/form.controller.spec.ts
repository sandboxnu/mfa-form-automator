import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SigningPositions } from '../ts/enums/SigningPositions';
import { Repository } from 'typeorm';
import { Form } from '../models/form.entity';
import { CreateFormDto, CreateFormDtoInternal, FormDto } from './form.dto';
import { FormService } from './form.service';
import { SignatureChainService } from '../signatureChain/signatureChain.service';
import { SignatureChainLink } from '../models/signatureChainLink.entity';
import {
  CreateSignatureChainDto,
  CreateSignatureChainLinkDto,
} from '../signatureChain/signatureChain.dto';

describe('FormService', () => {
  // Instantiate formService and formRepository
  let formService: FormService;
  let formRepository: Repository<Form>;
  let signatureChainService: SignatureChainService;
  const FORM_REPOSITORY_TOKEN = getRepositoryToken(Form);

  beforeEach(async () => {
    // Mocking the FormService and TypeOrm methods used in FormService
    const moduleRef = await Test.createTestingModule({
      providers: [
        FormService,
        {
          provide: SignatureChainService,
          useValue: {
            createSignatureChain: jest.fn((): SignatureChainLink => {
              const signatureChainLinkHead: SignatureChainLink = {
                id: 1,
                form: null,
                formId: 1,
                position: SigningPositions.MANAGER,
                specificPositionid: null,
                specificPosition: null,
                nextSignatureId: null,
                nextSignature: null,
              };
              return signatureChainLinkHead;
            }),
          },
        },
        {
          provide: FORM_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn((entity: FormDto): Form => {
              const form: Form = {
                id: null,
                name: entity.name,
                pdfLink: entity.pdfLink,
                signatureChainLinkHead: entity.signatureChainLinkHead,
                signatureChainLinkHeadId: null,
                formInstances: [],
              };
              return form;
            }),
            update: jest.fn((entity) => {
              entity.signatureChainLinkHeadId = 1;
              return entity;
            }),
            insert: jest.fn((entity) => {
              entity.id = 1;
              return entity;
            }),
          },
        },
      ],
    }).compile();

    // Initialize the formService and formRepository with the mock values
    formService = moduleRef.get<FormService>(FormService);
    formRepository = moduleRef.get<Repository<Form>>(FORM_REPOSITORY_TOKEN);
    signatureChainService = moduleRef.get<SignatureChainService>(
      SignatureChainService,
    );
  });

  it('formService should be defined', () => {
    expect(formService).toBeDefined();
  });

  it('formRepository should be defined', () => {
    expect(formRepository).toBeDefined();
  });

  it('signatureChainService should be defined', () => {
    expect(signatureChainService).toBeDefined();
  });

  describe('Tests creating a form', () => {
    let createFormDto: CreateFormDto;
    let createdForm: Form;
    let signatureChainLinks: CreateSignatureChainLinkDto[] = [
      {
        position: SigningPositions.MANAGER,
        specificPositionId: null,
      },
      {
        position: SigningPositions.DEPARTMENT_HEAD,
        specificPositionId: null,
      },
    ];

    beforeAll(() => {
      createFormDto = {
        name: 'form1',
        pdfLink: 'https://www.sandboxnu.com/',
        signatureChainLinks: signatureChainLinks,
      };
    });

    beforeEach(async () => {
      createdForm = await formService.createForm(createFormDto);
    });

    it('should call formRepository.create', () => {
      const formDtoInternal: CreateFormDtoInternal = {
        name: createFormDto.name,
        pdfLink: createFormDto.pdfLink,
        signatureChainLinkHead: null,
        formInstances: [],
      };
      expect(formRepository.create).toHaveBeenCalledWith(formDtoInternal);
    });

    it('should call signatureChainLinkService.createSignatureChain', () => {
      const createSignatureChainDto: CreateSignatureChainDto = {
        formId: 1,
        signatureChainLinks: signatureChainLinks,
      };
      expect(signatureChainService.createSignatureChain).toHaveBeenCalledWith(
        createSignatureChainDto,
      );
    });

    it('should return the created form', () => {
      expect(createdForm.id).toBe(1);
      expect(createdForm.name).toBe(createFormDto.name);
      expect(createdForm.signatureChainLinkHeadId).toBe(1);
      expect(createdForm.formInstances).toStrictEqual([]);
    });
  });
});
