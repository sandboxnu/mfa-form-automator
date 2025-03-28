import { Employee } from '@prisma/client';

export interface EmailHandler {
  sendEmail(to: string, subject: string, textBody: string): Promise<void>;
  sendFormCreatedEmail(
    to: string,
    originatorName: string,
    formName: string,
  ): Promise<void>;
  sendReadyForSignatureToUserEmail(
    to: string,
    signerName: string,
    formName: string,
  ): Promise<void>;
  sendReadyForSignatureToDepartmentEmail(
    departmentId: string,
    formName: string,
  ): Promise<void>;
  sendReadyForSignatureToPositionEmail(
    positionId: string,
    formName: string,
  ): Promise<void>;
  sendReadyForSignatureToUserListEmail(
    userList: Employee[],
    formName: string,
  ): Promise<void>;
  sendSignedEmail(
    to: string,
    originatorName: string,
    signerName: string,
    formName: string,
  ): Promise<void>;
  sendReadyForApprovalEmail(
    to: string,
    originatorName: string,
    formName: string,
  ): Promise<void>;
}
