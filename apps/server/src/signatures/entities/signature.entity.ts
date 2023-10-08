import { Signature } from "@prisma/client";
import { PositionEntity } from './../../positions/entities/position.entity';
import { EmployeeEntity } from './../../employees/entities/employee.entity';
import { FormInstanceEntity } from './../../form-instances/entities/form-instance.entity';

export class SignatureEntity implements Signature {
  id: string;
  order: number;
  signed: boolean;
  signedDocLink: string | null;
  createdAt: Date;
  updatedAt: Date;
  signerPositionId: string | null;
  userSignedById: string | null;
  formInstanceId: string;
}
