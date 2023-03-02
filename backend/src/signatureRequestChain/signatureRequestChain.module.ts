import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentModule } from '../department/department.module';
import { SignatureRequestLink } from '../models/signatureRequestLink.entity';
import { PositionModule } from '../position/position.module';
import { SignatureChainModule } from '../signatureChain/signatureChain.module';
import { SignatureRequestChainService } from './signatureRequestChain.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SignatureRequestLink]),
    SignatureChainModule,
    PositionModule,
    DepartmentModule,
  ],
  exports: [SignatureRequestChainService],
  providers: [SignatureRequestChainService],
  controllers: [],
})
export class SignatureRequestChainModule {}
