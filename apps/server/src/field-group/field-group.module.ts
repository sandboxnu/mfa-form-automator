import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';
import { FieldGroupService } from './field-group.service';

@Module({
  controllers: [],
  providers: [FieldGroupService],
  exports: [FieldGroupService],
  imports: [PrismaModule, LoggerModule],
})
export class FieldGroupModule {}
