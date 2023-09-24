import { Module } from '@nestjs/common';
import { FormTemplatesService } from './form-templates.service';
import { FormTemplatesController } from './form-templates.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [FormTemplatesController],
  providers: [FormTemplatesService],
  imports: [PrismaModule],
})
export class FormTemplatesModule {}
