import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class LoggerServiceImpl extends ConsoleLogger implements LoggerService {}
