import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentModule } from 'src/department/department.module';
import { SignatureRequestLink } from 'src/models/signatureRequestLink.entity';
import { PositionModule } from 'src/position/position.module';
import { SignatureChainModule } from 'src/signatureChain/signatureChain.module';
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
