import { Module } from '@nestjs/common';
import { PostmarkService } from './postmark.service';
import { PostmarkController } from './postmark.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FormTemplatesModule } from '../form-templates/form-templates.module';
import { PositionsModule } from '../positions/positions.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  controllers: [PostmarkController],
  providers: [PostmarkService],
  exports: [PostmarkService],
  imports: [PrismaModule, FormTemplatesModule, PositionsModule, LoggerModule],
})
export class PostmarkModule { }