import { Injectable } from '@nestjs/common';
import { ServerClient } from 'postmark';

@Injectable()
export class PostmarkService {
  client: ServerClient;

  constructor() {
    this.client = new ServerClient(process.env.POSTMARK_SERVER_KEY as string);
  }

  async sendEmail(to: string, subject: string, textBody: string) {
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
}
