import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SignatureRequestLink } from "src/models/signatureRequestLink.entity";
import { SignatureRequestChainService } from "./signatureRequestChain.service";

@Module({
    imports: [TypeOrmModule.forFeature([SignatureRequestLink])],
    exports: [SignatureRequestChainService],
    providers: [SignatureRequestChainService],
    controllers: [],
  })
  export class SignatureRequestChainModule {}
