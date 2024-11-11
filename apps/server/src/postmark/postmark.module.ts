import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';
import { PostmarkService } from './postmark.service';
import { PositionsModule } from '@server/positions/positions.module';

@Module({
  controllers: [],
  providers: [PostmarkService],
  exports: [PostmarkService],
  imports: [PrismaModule, LoggerModule, PositionsModule],
})
export class PostmarkModule {}
