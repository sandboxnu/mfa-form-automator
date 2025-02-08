import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateSignatureSignerDto } from './dto/update-signature-signer.dto';
import { SignatureErrorMessage } from './signatures.errors';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeesService } from '../employees/employees.service';
import { EmployeeErrorMessage } from '../employees/employees.errors';
import { DepartmentsService } from '../departments/departments.service';
import { DepartmentsErrorMessage } from '../departments/departments.errors';
import { PositionsService } from '../positions/positions.service';
import { PositionsErrorMessage } from '../positions/positions.errors';
import { SignerType } from '@prisma/client';

@Injectable()
export class SignaturesService {
  constructor(
    private prisma: PrismaService,
    private employeeService: EmployeesService,
    private departmentService: DepartmentsService,
    private positionService: PositionsService,
  ) {}

  async updateSigner(
    signatureId: string,
    updateSignatureSignerDto: UpdateSignatureSignerDto,
  ) {
    try {
      await this.findOne(signatureId);
    } catch (e) {
      throw new BadRequestException(SignatureErrorMessage.SIGNATURE_NOT_FOUND);
    }

    switch (updateSignatureSignerDto.signerType) {
      case SignerType.POSITION:
        if (!updateSignatureSignerDto.signerPositionId) {
          throw new BadRequestException(SignatureErrorMessage.MISSING_SIGNER);
        }
        try {
          await this.positionService.findOne(
            updateSignatureSignerDto.signerPositionId,
          );
        } catch (e) {
          throw new BadRequestException(
            PositionsErrorMessage.POSITION_NOT_FOUND,
          );
        }

        return await this.prisma.signature.update({
          where: {
            id: signatureId,
          },
          data: {
            signerType: SignerType.POSITION,
            signerPositionId: updateSignatureSignerDto.signerPositionId,
            signerDepartmentId: null,
            signerEmployeeId: null,
            signerEmployeeList: {
              set: [],
            },
          },
          include: {
            signerEmployeeList: true,
          },
        });
      case SignerType.DEPARTMENT:
        if (!updateSignatureSignerDto.signerDepartmentId) {
          throw new BadRequestException(SignatureErrorMessage.MISSING_SIGNER);
        }
        try {
          await this.departmentService.findOne(
            updateSignatureSignerDto.signerDepartmentId,
          );
        } catch (e) {
          throw new BadRequestException(
            DepartmentsErrorMessage.DEPARTMENT_NOT_FOUND,
          );
        }

        return await this.prisma.signature.update({
          where: {
            id: signatureId,
          },
          data: {
            signerType: 'DEPARTMENT',
            signerPositionId: null,
            signerDepartmentId: updateSignatureSignerDto.signerDepartmentId,
            signerEmployeeId: null,
            signerEmployeeList: {
              set: [],
            },
          },
          include: {
            signerEmployeeList: true,
          },
        });
      case SignerType.USER:
        if (!updateSignatureSignerDto.signerEmployeeId) {
          throw new BadRequestException(SignatureErrorMessage.MISSING_SIGNER);
        }
        try {
          await this.employeeService.findOne(
            updateSignatureSignerDto.signerEmployeeId,
          );
        } catch (e) {
          throw new BadRequestException(
            EmployeeErrorMessage.EMPLOYEE_NOT_FOUND,
          );
        }

        return await this.prisma.signature.update({
          where: {
            id: signatureId,
          },
          data: {
            signerType: SignerType.USER,
            signerPositionId: null,
            signerDepartmentId: null,
            signerEmployeeId: updateSignatureSignerDto.signerEmployeeId,
            signerEmployeeList: {
              set: [],
            },
          },
          include: {
            signerEmployeeList: true,
          },
        });
      case SignerType.USER_LIST:
        if (!updateSignatureSignerDto.signerEmployeeList) {
          throw new BadRequestException(SignatureErrorMessage.MISSING_SIGNER);
        }

        for (const employee of updateSignatureSignerDto.signerEmployeeList) {
          try {
            await this.employeeService.findOne(employee.id);
          } catch (e) {
            throw new BadRequestException(
              EmployeeErrorMessage.EMPLOYEE_NOT_FOUND,
            );
          }
        }

        return await this.prisma.signature.update({
          where: {
            id: signatureId,
          },
          data: {
            signerType: SignerType.USER_LIST,
            signerPositionId: null,
            signerDepartmentId: null,
            signerEmployeeId: null,
            signerEmployeeList: {
              set: updateSignatureSignerDto.signerEmployeeList,
            },
          },
          include: {
            signerEmployeeList: true,
          },
        });
      default:
        throw new BadRequestException(
          SignatureErrorMessage.MISSING_SIGNER_TYPE,
        );
    }
  }
  async findOne(id: string) {
    const signature = await this.prisma.signature.findFirstOrThrow({
      where: {
        id: id,
      },
      include: {
        signerEmployeeList: true,
      },
    });
    return signature;
  }
}
