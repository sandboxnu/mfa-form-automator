import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';
import { PostmarkService } from './postmark.service';
import { PositionsModule } from '../positions/positions.module';
import PostmarkHandler from './PostmarkHandler';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [],
  providers: [
    PostmarkService,
    {
      provide: 'EmailHandler',
      useClass: PostmarkHandler,
    },
    PrismaService,
  ],
  exports: [PostmarkService],
  imports: [PrismaModule, LoggerModule, PositionsModule],
})
export class PostmarkModule {}
