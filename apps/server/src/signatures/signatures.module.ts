import { Module } from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { SignaturesController } from './signatures.controller';
import { LoggerModule } from '../logger/logger.module';

@Module({
  controllers: [SignaturesController],
  providers: [SignaturesService],
  imports: [LoggerModule],
})
export class SignaturesModule {}
