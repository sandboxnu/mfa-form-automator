import { EmailHandler } from './EmailHandlerInterface';
import { EmployeeBaseEntity } from '../employees/entities/employee.entity';

export default class MockEmailHandler implements EmailHandler {
  sendEmail(to: string, subject: string, textBody: string): Promise<void> {
    console.log(
      `Sent email to ${to} with subject ${subject} and body ${textBody}`,
    );
    return Promise.resolve();
  }
  sendFormCreatedEmail(
    to: string,
    originatorName: string,
    formName: string,
  ): Promise<void> {
    console.log(
      `Sent form created email to ${to} with originator ${originatorName} and form name ${formName}`,
    );
    return Promise.resolve();
  }
  sendReadyForSignatureToUserEmail(
    to: string,
    signerName: string,
    formName: string,
  ): Promise<void> {
    console.log(
      `Sent ready for signature email to ${to} with signer ${signerName} and form name ${formName}`,
    );
    return Promise.resolve();
  }
  sendReadyForSignatureToDepartmentEmail(
    departmentId: string,
    formName: string,
  ): Promise<void> {
    console.log(
      `Sent ready for signature email to department ${departmentId} with form name ${formName}`,
    );
    return Promise.resolve();
  }
  sendReadyForSignatureToPositionEmail(
    positionId: string,
    formName: string,
  ): Promise<void> {
    console.log(
      `Sent ready for signature email to position ${positionId} with form name ${formName}`,
    );
    return Promise.resolve();
  }
  sendReadyForSignatureToUserListEmail(
    userList: EmployeeBaseEntity[],
    formName: string,
  ): Promise<void> {
    console.log(
      `Sent ready for signature email to user list ${userList} with form name ${formName}`,
    );
    return Promise.resolve();
  }
  sendSignedEmail(
    to: string,
    originatorName: string,
    signerName: string,
    formName: string,
  ): Promise<void> {
    console.log(
      `Sent signed email to ${to} with originator ${originatorName}, signer ${signerName}, and form name ${formName}`,
    );
    return Promise.resolve();
  }
  sendReadyForApprovalEmail(
    to: string,
    originatorName: string,
    formName: string,
  ): Promise<void> {
    console.log(
      `Sent ready for approval email to ${to} with originator ${originatorName} and form name ${formName}`,
    );
    return Promise.resolve();
  }
}
