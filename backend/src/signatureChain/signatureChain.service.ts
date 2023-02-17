import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignatureChainLink } from 'src/models/signatureChainLink.entity';
import { Repository } from 'typeorm';
import {
  CreateSignatureChainDto,
  SignatureChainLinkDto,
} from './signatureChain.dto';

@Injectable()
export class SignatureChainService {
  constructor(
    @InjectRepository(SignatureChainLink)
    private signatureChainLinkRepository: Repository<SignatureChainLink>,
  ) {}

  async createSignatureChain(createSignatureChainDto: CreateSignatureChainDto) {
    let previousSignatureChainLinkId: number = null;
    let lastSignatureChainLink: SignatureChainLink = null;

    for (var createSignatureChainLinkDto of createSignatureChainDto.signatureChainLinks) {
      const signatureChainLinkDto: SignatureChainLinkDto = {
        formId: createSignatureChainDto.formId,
        position: createSignatureChainLinkDto.position,
        specificPositionId: createSignatureChainLinkDto.specificPositionId,
        nextSignatureId: previousSignatureChainLinkId,
      };
      const signatureChainLink: SignatureChainLink =
        this.signatureChainLinkRepository.create(signatureChainLinkDto);
      lastSignatureChainLink = await this.signatureChainLinkRepository.save(
        signatureChainLink,
      );
      previousSignatureChainLinkId = signatureChainLink.id;
    }
    return lastSignatureChainLink;
  }

  async getSignatureChainByNextSignatureId(nextSignatureId: number) {
    return this.signatureChainLinkRepository.findOne({
      where: {
        nextSignatureId: nextSignatureId
      }
    })
  }

  async getSignatureChainRootByFormId(formId: number) {
    return this.signatureChainLinkRepository.findOne({
      where: {
        formId: formId,
        nextSignatureId: null
      }
    })
  }
}
