import { Test, TestingModule } from '@nestjs/testing';
import { SignatureFieldsService } from './signature-fields.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('SignatureFieldsService', () => {
  let service: SignatureFieldsService;

  const mockPrismaService = {
    signatureField: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirstOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const signatureField1 = {
    id: '1',
    name: 'Signature Field 1',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    formTemplateId: '123',
  };

  const signatureField2 = {
    id: '2',
    name: 'Signature Field 2',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    formTemplateId: '456',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignatureFieldsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SignatureFieldsService>(SignatureFieldsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new signature field', async () => {
      const createSignatureFieldDTO = {
        name: 'Signature Field 1',
        order: 1,
        formTemplateId: '3',
      };

      const createdSignatureField = {
        ...createSignatureFieldDTO,
        id: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.signatureField.create.mockResolvedValue(
        createdSignatureField,
      );

      const result = await service.create(createSignatureFieldDTO);

      expect(result).toEqual(
        expect.objectContaining({
          ...createSignatureFieldDTO,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(mockPrismaService.signatureField.create).toHaveBeenCalledWith({
        data: createSignatureFieldDTO,
      });
    });
  });

  describe('findAll', () => {
    it('should return all signature fields when no limit is provided', async () => {
      const signatureFields = [signatureField1, signatureField2];

      mockPrismaService.signatureField.findMany.mockResolvedValue(
        signatureFields,
      );

      const result = await service.findAll();

      expect(result).toEqual(signatureFields);

      expect(mockPrismaService.signatureField.findMany).toHaveBeenCalledWith({
        take: undefined,
      });
    });

    it('should return a specific number of signature fields when a limit is provided', async () => {
      const signatureFields = [signatureField1];

      mockPrismaService.signatureField.findMany.mockResolvedValue(
        signatureFields,
      );

      const result = await service.findAll(1);

      expect(result).toEqual(signatureFields);

      expect(mockPrismaService.signatureField.findMany).toHaveBeenCalledWith({
        take: 1,
      });
    });

    it('should return an empty arra if no signature fields are found', async () => {
      mockPrismaService.signatureField.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockPrismaService.signatureField.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a signature field by id', async () => {
      const id = '1';

      mockPrismaService.signatureField.findFirstOrThrow.mockResolvedValue(
        signatureField1,
      );

      const result = await service.findOne(id);

      expect(
        mockPrismaService.signatureField.findFirstOrThrow,
      ).toHaveBeenCalledWith({
        where: { id },
      });

      expect(result).toEqual(
        expect.objectContaining({
          ...signatureField1,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('should throw an error if the signature field is not found', async () => {
      const id = 'fakeId';

      mockPrismaService.signatureField.findFirstOrThrow.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const id = '1';
    const updateSignatureFieldDto = {
      name: 'Signature Field 1 Updated',
      order: 2,
      formTemplateId: '789',
    };

    it('shoud update a signature field by id', async () => {
      const updatedSignatureField = {
        id: '1',
        ...updateSignatureFieldDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.signatureField.update.mockResolvedValue(
        updatedSignatureField,
      );

      const result = await service.update(id, updateSignatureFieldDto);

      expect(mockPrismaService.signatureField.update).toHaveBeenCalledWith({
        where: { id },
        data: updateSignatureFieldDto,
      });

      expect(result).toEqual(
        expect.objectContaining({
          ...updatedSignatureField,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('should update the updatedAt field after updating', async () => {
      const beforeUpdate = signatureField1.updatedAt;
      const updatedSignatureField = {
        ...signatureField1,
        updatedAt: new Date(beforeUpdate.getTime() + 1000),
      };

      mockPrismaService.signatureField.update.mockResolvedValue(
        updatedSignatureField,
      );

      const result = await service.update(
        signatureField1.id,
        updateSignatureFieldDto,
      );

      expect(result.updatedAt.getTime()).toBeGreaterThan(
        beforeUpdate.getTime(),
      );
    });

    it('should throw an error if updating fails', async () => {
      mockPrismaService.signatureField.update.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(service.update(id, updateSignatureFieldDto)).rejects.toThrow(
        'Update failed',
      );
    });

    it('should throw an error if updating fails from trying to update nonexistent signature field', async () => {
      mockPrismaService.signatureField.update.mockRejectedValue(
        new NotFoundException(),
      );

      const id = 'Fake Signature Field';

      await expect(service.update(id, updateSignatureFieldDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    const id = '1';

    it('should remove a signature field by id', async () => {
      mockPrismaService.signatureField.delete.mockResolvedValue({});

      await service.remove(id);

      expect(mockPrismaService.signatureField.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw an error if deltion fails', async () => {
      mockPrismaService.signatureField.delete.mockRejectedValue(
        new Error('Delete failed'),
      );

      await expect(service.remove(id)).rejects.toThrow('Delete failed');
    });

    it('should throw an error if remove fails from trying to remove nonexistent signature field', async () => {
      mockPrismaService.signatureField.delete.mockRejectedValue(
        new NotFoundException(),
      );

      const id = 'Fake Signature Field';

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
