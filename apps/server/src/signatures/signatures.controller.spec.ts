import { Test, TestingModule } from '@nestjs/testing';
import { SignaturesController } from './signatures.controller';
import { SignaturesService } from './signatures.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeesService } from '../employees/employees.service';
import { DepartmentsService } from '../departments/departments.service';
import { PositionsService } from '../positions/positions.service';
import { UpdateSignatureSignerDto } from './dto/update-signature-signer.dto';
import { SignerType } from '@prisma/client';

const mockSignatureService = {
  updateSigner: async (
    signatureId: string,
    updateSignatureSignerDto: UpdateSignatureSignerDto,
  ) => {
    return {
      id: signatureId,
      formInstanceId: 'form-instance-id',
      order: 1,
      signed: false,
      signedDocLink: null,
      signingEmployeeId: null,
      signerEmployeeList: [],
      signerEmployeeId: updateSignatureSignerDto.signerEmployeeId ?? null,
      signerDepartmentId: updateSignatureSignerDto.signerDepartmentId ?? null,
      signerPositionId: updateSignatureSignerDto.signerPositionId ?? null,
      signerType: updateSignatureSignerDto.signerType ?? SignerType.POSITION,
      createdAt: new Date(1672531200),
      updatedAt: new Date(1672531200),
    };
  },
};

describe('SignaturesController', () => {
  let controller: SignaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignaturesController],
      providers: [
        {
          provide: SignaturesService,
          useValue: mockSignatureService,
        },
        EmployeesService,
        DepartmentsService,
        PositionsService,
        PrismaService,
      ],
    }).compile();

    controller = module.get<SignaturesController>(SignaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should update signer', async () => {
    const response = await controller.updateSignatureSigner('signature-id', {
      signerType: 'DEPARTMENT',
      signerDepartmentId: 'department-id',
    });
    expect(response.signerType).toEqual(SignerType.DEPARTMENT);
    expect(response.signerDepartmentId).toEqual('department-id');
  });
});
