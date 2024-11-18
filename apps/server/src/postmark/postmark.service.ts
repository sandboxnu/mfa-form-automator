import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ServerClient } from 'postmark';

@Injectable()
export class PostmarkService {
  client: ServerClient;

  constructor(private prisma: PrismaService) {
    this.client = new ServerClient(process.env.POSTMARK_SERVER_KEY as string);
  }

  /**
   * Send an email using Postmark
   * @param to email address to send to
   * @param subject email subject
   * @param textBody email body
   * @returns Promise<void>
   */
  async sendEmail(to: string, subject: string, textBody: string) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Email:', { to, subject, textBody });
      return;
    }

    try {
      this.client.sendEmail({
        From: 'jfrederick@mfa.org',
        To: to,
        Subject: subject,
        TextBody: textBody,
        MessageStream: 'outbound',
      });
    } catch (error) {
      console.error('Error sending email through postmark:', error);
    }
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
    const subject: string = `Hi ${originatorName}, you have created a new form: ${formName}.`;
    const body: string = `Hi ${originatorName}, you have created a new form: ${formName}.`;

    await this.sendEmail(to, subject, body);
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
    const subject: string = `Form ${formName} Ready To Sign`;
    const body: string = `Hi ${signerName}, you have a form ready for your signature: ${formName}.`;

    await this.sendEmail(to, subject, body);
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
    const employees = await this.prisma.employee.findMany({
      where: {
        position: {
          departmentId,
        },
      },
    });

    employees.forEach(async (employee) => {
      await this.sendReadyForSignatureToUserEmail(
        employee.email,
        `${employee.firstName} ${employee.lastName}`,
        formName,
      );
    });
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
    const employees = await this.prisma.employee.findMany({
      where: {
        positionId,
      },
    });

    employees.forEach(async (employee) => {
      await this.sendReadyForSignatureToUserEmail(
        employee.email,
        `${employee.firstName} ${employee.lastName}`,
        formName,
      );
    });
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
    signerFirstName: string,
    signerLastName: string,
    formName: string,
  ) {
    const subject: string = `Form ${formName} Signed By ${signerFirstName} ${signerLastName}`;
    const body: string = `Hi ${originatorName}, your form ${formName} has been signed by user: ${signerFirstName} ${signerLastName}.`;

    await this.sendEmail(to, subject, body);
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
    const subject: string = `Form ${formName} Ready for Approval`;
    const body: string = `Hi ${originatorName}, your form ${formName} is completed and is ready for your approval: ${formName}.`;

    await this.sendEmail(to, subject, body);
  }
}
