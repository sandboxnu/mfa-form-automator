import {
    Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FormTemplatesService } from '../form-templates/form-templates.service';
import { PositionsService } from '../positions/positions.service';

const postmark = require('postmark');
const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_KEY);

@Injectable()
export class PostmarkService {
    constructor(
        private prisma: PrismaService,
        private formTemplateService: FormTemplatesService,
        private positionService: PositionsService,
    ) { }

    async create() {
        client.sendEmail({
            'From': 'jfrederick@mfa.org',
            'To': 'weigl.a@northeastern.edu',
            'Subject': 'Hello from Postmark',
            'HtmlBody': '<strong>Hello < /strong> dear Postmark user.',
            'TextBody': 'Hello from Postmark!',
            'MessageStream': 'outbound'
        });
    }
}