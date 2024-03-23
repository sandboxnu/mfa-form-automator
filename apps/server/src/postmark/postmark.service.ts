import { Injectable } from '@nestjs/common';
import postmark from 'postmark';

@Injectable()
export class PostmarkService {
  client: postmark.ServerClient;

  constructor() {
    this.client = new postmark.ServerClient(
      process.env.POSTMARK_SERVER_KEY || '',
    );
  }

  async sendEmail(to: string, subject: string, textBody: string) {
    try {
      this.client.sendEmail({
        From: 'jfrederick@mfa.org',
        To: to,
        Subject: subject,
        // TODO FIXME when this is uncommented the text body doesn't show up
        // 'HtmlBody': '<strong>Hello < /strong> dear Postmark user.',
        TextBody: textBody,
        MessageStream: 'outbound',
      });
      console.log('email sent');
    } catch (error) {
      console.error('Error sending email throug postmark:', error);
    }
  }
}
