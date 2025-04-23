import { Inject, Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { EmailHandler } from './EmailHandlerInterface';
import { EmployeeBaseEntity } from '../employees/entities/employee.entity';

@Injectable()
export class PostmarkService {
  constructor(
    @Inject('EmailHandler')
    private emailHandler: EmailHandler,
  ) {}

  /**
   * Send an email using Postmark
   * @param to email address to send to
   * @param subject email subject
   * @param textBody email body
   * @returns Promise<void>
   */
  async sendEmail(to: string, subject: string, textBody: string) {
    await this.emailHandler.sendEmail(to, subject, textBody);
  }

  /**
   * Send an email to the originator that a form has been created
   * @param to email address to send to
   * @param originatorName the name of the originator
   * @param formName the name of the form
   */
  async sendFormCreatedEmail(
    to: string,
    originatorName: string,
    formName: string,
  ) {
    await this.emailHandler.sendFormCreatedEmail(to, originatorName, formName);
  }

  /**
   * Send an email to a signer that a form is ready for their signature
   * @param to email address to send to
   * @param signerFirstName the name of the signer
   * @param formName the name of the form
   */
  async sendReadyForSignatureToUserEmail(
    to: string,
    signerName: string,
    formName: string,
  ) {
    await this.emailHandler.sendReadyForSignatureToUserEmail(
      to,
      signerName,
      formName,
    );
  }

  /**
   * Send an email to a department that a form is ready for their signature
   * @param departmentId the id of the department
   * @param formName the name of the form
   */
  async sendReadyForSignatureToDepartmentEmail(
    departmentId: string,
    formName: string,
  ) {
    await this.emailHandler.sendReadyForSignatureToDepartmentEmail(
      departmentId,
      formName,
    );
  }

  /**
   * Send an email to a position that a form is ready for their signature
   * @param positionId the id of the position
   * @param formName the name of the form
   */
  async sendReadyForSignatureToPositionEmail(
    positionId: string,
    formName: string,
  ) {
    await this.emailHandler.sendReadyForSignatureToPositionEmail(
      positionId,
      formName,
    );
  }

  /**
   * Send an email to a list of users that a form is ready for their signature
   * @param to the list of email addresses to send to
   * @param formName
   */
  async sendReadyForSignatureToUserListEmail(
    userList: EmployeeBaseEntity[],
    formName: string,
  ) {
    await this.emailHandler.sendReadyForSignatureToUserListEmail(
      userList,
      formName,
    );
  }

  /**
   * Send an email to the originator that a form has been signed
   * @param to email address to send to
   * @param originatorName the name of the originator
   * @param signerFirstName the first name of the signer
   * @param signerLastName the last name of the signer
   * @param formName the name of the form
   */
  async sendSignedEmail(
    to: string,
    originatorName: string,
    signerName: string,
    formName: string,
  ) {
    await this.emailHandler.sendSignedEmail(
      to,
      originatorName,
      signerName,
      formName,
    );
  }

  /**
   * Send an email to the originator that a form is ready for their approval
   * @param to email address to send to
   * @param originatorName the name of the originator
   * @param formName the name of the form
   */
  async sendReadyForApprovalEmail(
    to: string,
    originatorName: string,
    formName: string,
  ) {
    await this.emailHandler.sendReadyForApprovalEmail(
      to,
      originatorName,
      formName,
    );
  }
}
