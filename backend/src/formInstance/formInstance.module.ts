import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormModule } from 'src/form/form.module';
import { PositionModule } from 'src/position/position.module';
import { SignatureRequestChainModule } from 'src/signatureRequestChain/signatureRequestChain.module';
import { FormInstance } from '../models/formInstance.entity';
import { FormInstanceController } from './formInstance.controller';
import { FormInstanceService } from './formInstance.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FormInstance]),
    PositionModule,
    FormModule,
    SignatureRequestChainModule,
  ],
  exports: [],
  providers: [FormInstanceService],
  controllers: [FormInstanceController],
})
export class FormInstanceModule {}
