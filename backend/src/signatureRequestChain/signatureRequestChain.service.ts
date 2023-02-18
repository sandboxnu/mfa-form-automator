import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignatureChainLink } from 'src/models/signatureChainLink.entity';
import { SignatureRequestLink } from 'src/models/signatureRequestLink.entity';
import { SignatureChainService } from 'src/signatureChain/signatureChain.service';
import { Repository } from 'typeorm';
import {
  CreateSignatureRequestChainDto,
  SignatureRequestChainLinkDto,
} from './signatureRequestChain.dto';

@Injectable()
export class SignatureRequestChainService {
  constructor(
    @InjectRepository(SignatureRequestLink)
    private signatureRequestLinkRepository: Repository<SignatureRequestLink>,
    @Inject(SignatureChainService)
    private signatureChainService: SignatureChainService,
  ) {}

  async createSignatureRequestChain(
    createSignatureChainRequestDto: CreateSignatureRequestChainDto,
  ) {
    let lastSignatureRequestLink: SignatureRequestLink = null;
    let signatureChainLinkNext: SignatureChainLink =
      await this.signatureChainService.getSignatureChainRootByFormId(
        createSignatureChainRequestDto.formId,
      );
    let signatureChainLinkCurrent: SignatureChainLink =
      await this.signatureChainService.getSignatureChainByNextSignatureId(
        signatureChainLinkNext.id,
      );

    while (signatureChainLinkCurrent != null) {
      const signatureRequestChainLinkDto: SignatureRequestChainLinkDto = {
        formInstanceId: createSignatureChainRequestDto.formInstanceId,
        isSigned: false,
        canSign: false,
        nextId: signatureChainLinkNext.id,
      };
      const signatureRequestChainLink: SignatureRequestLink =
        this.signatureRequestLinkRepository.create(
          signatureRequestChainLinkDto,
        );
      lastSignatureRequestLink = await this.signatureRequestLinkRepository.save(
        signatureRequestChainLink,
      );
      signatureChainLinkNext = signatureChainLinkCurrent;
      signatureChainLinkCurrent =
        await this.signatureChainService.getSignatureChainByNextSignatureId(
          signatureChainLinkNext.id,
        );
    }
    return lastSignatureRequestLink;
  }
}
