import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignatureChainLink } from 'src/models/signatureChainLink.entity';
import { SignatureRequestLink } from 'src/models/signatureRequestLink.entity';
import { SignatureChainService } from 'src/signatureChain/signatureChain.service';
import { SigningPositions } from 'src/ts/enums/SigningPositions';
import { getManager, Repository } from 'typeorm';
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
    let specificPositionIdsSeen: number[] = [];

    while (signatureChainLinkCurrent != null) {
      if (
        this.positionHasBeenSeen(
          specificPositionIdsSeen,
          createSignatureChainRequestDto.initiatorId,
          signatureChainLinkCurrent.position,
          signatureChainLinkCurrent.specificPositionid,
        )
      ) {
        signatureChainLinkCurrent =
          await this.signatureChainService.getSignatureChainByNextSignatureId(
            signatureChainLinkNext.id,
          );
        continue;
      } else {
        const signatureRequestChainLinkDto: SignatureRequestChainLinkDto = {
          formInstanceId: createSignatureChainRequestDto.formInstanceId,
          signatureChainLinkId: signatureChainLinkCurrent.id,
          isSigned: false,
          canSign: false,
          nextId: signatureChainLinkNext.id,
        };
        const signatureRequestChainLink: SignatureRequestLink =
          this.signatureRequestLinkRepository.create(
            signatureRequestChainLinkDto,
          );
        lastSignatureRequestLink =
          await this.signatureRequestLinkRepository.save(
            signatureRequestChainLink,
          );
        signatureChainLinkNext = signatureChainLinkCurrent;
        signatureChainLinkCurrent =
          await this.signatureChainService.getSignatureChainByNextSignatureId(
            signatureChainLinkNext.id,
          );
        specificPositionIdsSeen.push(
          signatureChainLinkCurrent.specificPositionid,
        );
      }
    }
    return lastSignatureRequestLink;
  }

  private async positionHasBeenSeen(
    seen: number[],
    initiatorId: number,
    position?: SigningPositions,
    specificPositionId?: number,
  ) {
    // (list of visited specific position ids, signingposition enum value, initiator position id): boolean {
    // if (
    //   signatureChainLinkCurrent.specificPositionid != null &&
    //   specificPositionIdsSeen.includes(
    //     signatureChainLinkCurrent.specificPositionid,
    //   )
    // )
    //   switch (enum)
    //   case manager
    //     refer to the initiator's manager id field
    //   case departmenthead
    //     search through all positions for the department head of the initiator's department
    //   case leadershipteam
    //     refer to department leadership team person id for the department of the initiator
    //   check if this person's id is in our list of visited ids, if it is return true, else return false
    // }
    return true;
  }
}
