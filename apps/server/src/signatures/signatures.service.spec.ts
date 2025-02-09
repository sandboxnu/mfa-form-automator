import { Test, TestingModule } from '@nestjs/testing';
import { SignaturesService } from './signatures.service';
import { EmployeesService } from '../employees/employees.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, SignerType } from '@prisma/client';
import { ConnectEmployeeDto } from './dto/create-signature.dto';
import { DepartmentsService } from '../departments/departments.service';
import { PositionsService } from '../positions/positions.service';

const signaturePositionSigner = {
  id: 'signature-id',
  formInstanceId: 'form-instance-id',
  signerType: SignerType.POSITION,
  signerPositionId: 'position-id',
  signerDepartmentId: null,
  signerEmployeeId: null,
  signerEmployeeList: [],
  createdAt: new Date(1672531200),
  updatedAt: new Date(1672531200),
};

const signatureDepartmentSigner = {
  id: 'signature-id',
  formInstanceId: 'form-instance-id',
  signerType: SignerType.DEPARTMENT,
  signerPositionId: null,
  signerDepartmentId: 'department-id',
  signerEmployeeId: null,
  signerEmployeeList: [],
  createdAt: new Date(1672531200),
  updatedAt: new Date(1672531200),
};

const db = {
  signature: {
    findFirstOrThrow: jest.fn().mockResolvedValue(signaturePositionSigner),
    update: jest.fn().mockImplementation((args) => {
      const val = {
        ...signaturePositionSigner,
        ...args.data,
      };
      if (args.data.signerEmployeeList.set.length === 0) {
        val.signerEmployeeList = [];
      } else {
        val.signerEmployeeList = args.data.signerEmployeeList.set.map(
          (v: ConnectEmployeeDto) => v.id,
        );
      }
      return val;
    }),
  },
  employee: {
    findFirstOrThrow: jest.fn(),
  },
  department: {
    findFirstOrThrow: jest.fn(),
  },
  position: {
    findFirstOrThrow: jest.fn(),
  },
};

describe('SignaturesService', () => {
  let service: SignaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignaturesService,
        EmployeesService,
        DepartmentsService,
        PositionsService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<SignaturesService>(SignaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateSigner', () => {
    beforeEach(() => {
      db.signature.findFirstOrThrow.mockResolvedValue(signaturePositionSigner);

      db.employee.findFirstOrThrow = jest.fn(async (val) => {
        if (val.where.id === 'unknown') {
          throw new Prisma.PrismaClientKnownRequestError('', {
            code: 'P2025',
            clientVersion: '',
            meta: undefined,
            batchRequestIdx: undefined,
          });
        } else {
          return {};
        }
      });

      db.department.findFirstOrThrow = jest.fn(async (val) => {
        if (val.where.id === 'unknown') {
          throw new Prisma.PrismaClientKnownRequestError('', {
            code: 'P2025',
            clientVersion: '',
            meta: undefined,
            batchRequestIdx: undefined,
          });
        } else {
          return {};
        }
      });
    });

    describe('success', () => {
      it('should update the signer to a position', async () => {
        db.signature.findFirstOrThrow.mockResolvedValue(
          signatureDepartmentSigner,
        );

        const updateSignatureSignerDto = {
          signerType: SignerType.POSITION,
          signerPositionId: 'position-id',
          signerDepartmentId: null,
          signerEmployeeId: null,
        };
        const updatedSignature = await service.updateSigner(
          'signature-id',
          updateSignatureSignerDto,
        );
        expect(updatedSignature.signerType).toEqual(SignerType.POSITION);
        expect(updatedSignature.signerPositionId).toEqual('position-id');
        expect(updatedSignature.signerDepartmentId).toBeNull();
        expect(updatedSignature.signerEmployeeId).toBeNull();
        expect(updatedSignature.signerEmployeeList).toEqual([]);
      });

      it('should update the signer to a department', async () => {
        db.signature.findFirstOrThrow.mockResolvedValue(
          signaturePositionSigner,
        );

        const updateSignatureSignerDto = {
          signerType: SignerType.DEPARTMENT,
          signerPositionId: null,
          signerDepartmentId: 'department-id',
          signerEmployeeId: null,
        };
        const updatedSignature = await service.updateSigner(
          'signature-id',
          updateSignatureSignerDto,
        );
        expect(updatedSignature.signerType).toEqual(SignerType.DEPARTMENT);
        expect(updatedSignature.signerPositionId).toBeNull();
        expect(updatedSignature.signerDepartmentId).toEqual('department-id');
        expect(updatedSignature.signerEmployeeId).toBeNull();
        expect(updatedSignature.signerEmployeeList).toEqual([]);
      });

      it('should update the signer to an employee', async () => {
        db.signature.findFirstOrThrow.mockResolvedValue(
          signaturePositionSigner,
        );

        const updateSignatureSignerDto = {
          signerType: SignerType.USER,
          signerPositionId: null,
          signerDepartmentId: null,
          signerEmployeeId: 'employee-id',
        };
        const updatedSignature = await service.updateSigner(
          'signature-id',
          updateSignatureSignerDto,
        );
        expect(updatedSignature.signerType).toEqual(SignerType.USER);
        expect(updatedSignature.signerPositionId).toBeNull();
        expect(updatedSignature.signerDepartmentId).toBeNull();
        expect(updatedSignature.signerEmployeeId).toEqual('employee-id');
        expect(updatedSignature.signerEmployeeList).toEqual([]);
      });

      it('should update the signer to a list of employees', async () => {
        db.signature.findFirstOrThrow.mockResolvedValue(
          signaturePositionSigner,
        );

        const updateSignatureSignerDto = {
          signerType: SignerType.USER_LIST,
          signerPositionId: null,
          signerDepartmentId: null,
          signerEmployeeId: null,
          signerEmployeeList: [
            { id: 'employee-id-1' },
            { id: 'employee-id-2' },
          ],
        };
        const updatedSignature = await service.updateSigner(
          'signature-id',
          updateSignatureSignerDto,
        );
        expect(updatedSignature.signerType).toEqual(SignerType.USER_LIST);
        expect(updatedSignature.signerPositionId).toBeNull();
        expect(updatedSignature.signerDepartmentId).toBeNull();
        expect(updatedSignature.signerEmployeeId).toBeNull();
        expect(updatedSignature.signerEmployeeList).toEqual([
          'employee-id-1',
          'employee-id-2',
        ]);
      });
    });

    describe('error', () => {
      it('should throw if signature not found', async () => {
        db.signature.findFirstOrThrow.mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError('', {
            code: 'P2025',
            clientVersion: '',
            meta: undefined,
            batchRequestIdx: undefined,
          }),
        );
        const updateSignatureSignerDto = {
          signerType: SignerType.POSITION,
          signerPositionId: 'position-id',
          signerDepartmentId: null,
          signerEmployeeId: null,
        };
        expect(
          service.updateSigner('signature-id', updateSignatureSignerDto),
        ).rejects.toThrowError();
      });
      it('should throw if invalid position specified', async () => {
        db.position.findFirstOrThrow.mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError('', {
            code: 'P2025',
            clientVersion: '',
            meta: undefined,
            batchRequestIdx: undefined,
          }),
        );

        const updateSignatureSignerDto = {
          signerType: SignerType.POSITION,
          signerPositionId: 'unknown',
        };
        expect(
          service.updateSigner('signature-id', updateSignatureSignerDto),
        ).rejects.toThrowError();
      });

      it('should throw if invalid department specified', async () => {
        const updateSignatureSignerDto = {
          signerType: SignerType.DEPARTMENT,
          signerPositionId: null,
          signerDepartmentId: 'unknown',
          signerEmployeeId: null,
        };
        expect(
          service.updateSigner('signature-id', updateSignatureSignerDto),
        ).rejects.toThrowError();
      });

      it('should throw if invalid employee specified', async () => {
        const updateSignatureSignerDto = {
          signerType: SignerType.USER,
          signerPositionId: null,
          signerDepartmentId: null,
          signerEmployeeId: 'unknown',
        };
        expect(
          service.updateSigner('signature-id', updateSignatureSignerDto),
        ).rejects.toThrowError();
      });

      it('should throw if invalid employee in list of employees', async () => {
        const updateSignatureSignerDto = {
          signerType: SignerType.USER_LIST,
          signerPositionId: null,
          signerDepartmentId: null,
          signerEmployeeId: null,
          signerEmployeeList: [{ id: 'employee-id-1' }, { id: 'unknown' }],
        };
        expect(
          service.updateSigner('signature-id', updateSignatureSignerDto),
        ).rejects.toThrowError();
      });
    });
  });

  describe('findOne', () => {
    it('should find one signature', async () => {
      expect(service.findOne('signature-id')).resolves.toEqual(
        signaturePositionSigner,
      );
    });

    it('should throw an error if signature is not found', async () => {
      db.signature.findFirstOrThrow = jest.fn().mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2025',
          clientVersion: '',
          meta: undefined,
          batchRequestIdx: undefined,
        }),
      );
      expect(service.findOne('signature-id')).rejects.toThrowError();
    });
  });
});
