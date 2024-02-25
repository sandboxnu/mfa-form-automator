import {
    Controller,
    Post,
} from '@nestjs/common';
import { PostmarkService } from './postmark.service';
import {
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiUnprocessableEntityResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AppErrorMessage } from '../app.errors';

@ApiTags('postmark')
@Controller('postmark')
export class PostmarkController {
    constructor(
        private readonly postmarkService: PostmarkService,
    ) { }

    @Post()
    @ApiCreatedResponse({ type: String })
    @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
    @ApiUnprocessableEntityResponse({
        description: AppErrorMessage.UNPROCESSABLE_ENTITY,
    })
    async create() {
        const newFormInstance = await this.postmarkService.create();
        return newFormInstance;
    }
}
