import { Module } from '@nestjs/common';
import { LoggerServiceImpl } from './logger.service';

@Module({
  providers: [LoggerServiceImpl],
  exports: [LoggerServiceImpl],
})
export class LoggerModule {}
