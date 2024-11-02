import { Test, TestingModule } from '@nestjs/testing';
import { SignatureFieldsController } from './signature-fields.controller';
import { SignatureFieldsService } from './signature-fields.service';
import { LoggerServiceImpl } from '../logger/logger.service';
import { SignatureFieldEntity } from './entities/signature-field.entity';
import { NotFoundException } from '@nestjs/common';
import { SignatureFieldErrorMessage } from './signature-fields.errors';

describe('SignatureFieldsController', () => {
  let controller: SignatureFieldsController;
  let service: SignatureFieldsService;

  const mockSignatureFieldService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockLoggerService = {
    error: jest.fn(),
  };

  const signatureField1 = {
    id: '1',
    name: 'Signature Field 1',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    signerPositionId: 'Chief',
    formTemplateId: '123',
  };

  const signatureField2 = {
    id: '2',
    name: 'Signature Field 2',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    signerPositionId: 'Manager',
    formTemplateId: '456',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignatureFieldsController],
      providers: [
        {
          provide: SignatureFieldsService,
          useValue: mockSignatureFieldService,
        },
        { provide: LoggerServiceImpl, useValue: mockLoggerService },
      ],
    }).compile();

    controller = module.get<SignatureFieldsController>(
      SignatureFieldsController,
    );
    service = module.get<SignatureFieldsService>(SignatureFieldsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createSignatureFieldDTO = {
      name: 'Signature Field 1',
      order: 1,
      signerPositionId: 'Chief',
      formTemplateId: '3',
    };

    const createdSignatureField = {
      ...createSignatureFieldDTO,
      id: '123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should call service.create and return the created signature field', async () => {
      mockSignatureFieldService.create.mockResolvedValue(createdSignatureField);

      const result = await controller.create(createSignatureFieldDTO);

      expect(service.create).toHaveBeenCalledWith(createSignatureFieldDTO);
      expect(result).toEqual(new SignatureFieldEntity(createdSignatureField));
    });

    it('should throw an error for invalid data', async () => {
      mockSignatureFieldService.create.mockRejectedValue(
        new Error('Validation error'),
      );

      await expect(
        controller.create({
          name: '',
          order: -1,
          signerPositionId: '',
          formTemplateId: '',
        }),
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return the fetched signature fields', async () => {
      const signatureFields = [signatureField1, signatureField2];

      mockSignatureFieldService.findAll.mockResolvedValue(signatureFields);
      const result = await service.findAll();

      expect(result).toEqual(signatureFields);
      expect(mockSignatureFieldService.findAll).toHaveBeenCalled();
    });

    it('should call service.findAll and return the fetched signature fields with a limit param when provided', async () => {
      mockSignatureFieldService.findAll.mockResolvedValue([signatureField1]);

      const result = await controller.findAll(1);

      expect(service.findAll).toHaveBeenCalledWith(1);
      expect(result).toEqual([new SignatureFieldEntity(signatureField1)]);
    });
  });

  describe('findOne', () => {
    const createSignatureFieldDTO = {
      name: 'Signature Field 1',
      order: 1,
      signerPositionId: 'Chief',
      formTemplateId: '3',
    };

    const createdSignatureField = {
      ...createSignatureFieldDTO,
      id: '123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should call service.create and return the created signature field', async () => {
      mockSignatureFieldService.create.mockResolvedValue(createdSignatureField);

      const result = await controller.create(createSignatureFieldDTO);

      expect(service.create).toHaveBeenCalledWith(createSignatureFieldDTO);
      expect(result).toEqual(new SignatureFieldEntity(createdSignatureField));
    });

    it('should throw NotFoundException if signature field is not found', async () => {
      mockSignatureFieldService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('fakeId')).rejects.toThrow(
        new NotFoundException(
          SignatureFieldErrorMessage.SIGNATURE_FIELD_NOT_FOUND_CLIENT,
        ),
      );

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        SignatureFieldErrorMessage.SIGNATURE_FIELD_NOT_FOUND,
      );
    });
  });

  describe('update', () => {
    it('should call service.update and return the updated signature field', async () => {
      const updateData = { name: 'UpdatedField' };
      const updatedSignatureField = { ...signatureField1, ...updateData };

      mockSignatureFieldService.update.mockResolvedValue(updatedSignatureField);

      const result = await controller.update('1', updateData);

      expect(service.update).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(new SignatureFieldEntity(updatedSignatureField));
    });
  });

  describe('remove', () => {
    it('should delete the signature field', async () => {
      mockSignatureFieldService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenLastCalledWith('1');
      expect(result).toBeUndefined();
    });
  });
});
