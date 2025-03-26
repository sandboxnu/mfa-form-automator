import { Employee } from '@prisma/client';
import { EmailHandler } from './EmailHandlerInterface';

export default class MockEmailHandler implements EmailHandler {
  sendEmail(_: string, __: string, ___: string): Promise<void> {
    return Promise.resolve();
  }
  sendFormCreatedEmail(_: string, __: string, ___: string): Promise<void> {
    return Promise.resolve();
  }
  sendReadyForSignatureToUserEmail(
    _: string,
    __: string,
    ___: string,
  ): Promise<void> {
    return Promise.resolve();
  }
  sendReadyForSignatureToDepartmentEmail(_: string, __: string): Promise<void> {
    return Promise.resolve();
  }
  sendReadyForSignatureToPositionEmail(_: string, __: string): Promise<void> {
    return Promise.resolve();
  }
  sendReadyForSignatureToUserListEmail(
    _: Employee[],
    __: string,
  ): Promise<void> {
    return Promise.resolve();
  }
  sendSignedEmail(
    _: string,
    __: string,
    ___: string,
    ____: string,
  ): Promise<void> {
    return Promise.resolve();
  }
  sendReadyForApprovalEmail(_: string, __: string, ___: string): Promise<void> {
    return Promise.resolve();
  }
}
