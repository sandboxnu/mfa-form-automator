import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SignatureRequestLink } from "src/models/signatureRequestLink.entity";
import { Repository } from "typeorm";

@Injectable()
export class SignatureRequestChainService {
    constructor(
        @InjectRepository(SignatureRequestLink)
        private signatureRequestLinkRepository: Repository<SignatureRequestLink>,
    ) {}
    
    // TODO: Create method to create a new signature request chain, given a form id, and returns head of new signature request chain
}
