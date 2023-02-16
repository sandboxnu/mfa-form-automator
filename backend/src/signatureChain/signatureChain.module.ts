import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SignatureChainLink } from "src/models/signatureChainLink.entity";
import { SignatureChainService } from "./signatureChain.service";

@Module({
    imports: [TypeOrmModule.forFeature([SignatureChainLink])],
    exports: [SignatureChainService],
    providers: [SignatureChainService],
    controllers: []
})
export class SignatureChainModule {};
