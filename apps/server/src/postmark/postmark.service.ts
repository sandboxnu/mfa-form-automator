import { Injectable } from '@nestjs/common';

import postmark from 'postmark';
const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_KEY || '');

@Injectable()
export class PostmarkService {
  constructor() {}

  async sendEmail(to: string, subject: string, textBody: string) {
    try {
      client.sendEmail({
        From: 'jfrederick@mfa.org',
        To: to,
        Subject: subject,
        // TODO FIXME when this is uncommented the text body doesn't show up
        // 'HtmlBody': '<strong>Hello < /strong> dear Postmark user.',
        TextBody: textBody,
        MessageStream: 'outbound',
      });
    } catch (error) {
      console.error('Error sending email through postmark:', error);
    }
  }
}
