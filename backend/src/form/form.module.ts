import { Module } from '@nestjs/common';
import { Form } from '../models/form.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { SignatureChainModule } from 'src/signatureChain/signatureChain.module';

@Module({
  imports: [TypeOrmModule.forFeature([Form]), SignatureChainModule],
  exports: [FormService],
  providers: [FormService],
  controllers: [FormController],
})
export class FormModule {}
