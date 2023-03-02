import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentService } from '../department/department.service';
import { SignatureChainLink } from '../models/signatureChainLink.entity';
import { SignatureRequestLink } from '../models/signatureRequestLink.entity';
import { PositionService } from '../position/position.service';
import { SignatureChainService } from '../signatureChain/signatureChain.service';
import { SigningPositions } from '../ts/enums/SigningPositions';
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
    @Inject(PositionService)
    private positionService: PositionService,
    @Inject(DepartmentService)
    private departmentService: DepartmentService,
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
    if (specificPositionId && seen.includes(specificPositionId)) {
      return true;
    }
    switch (position) {
      case SigningPositions.MANAGER:
        return this.positionService
          .getPositionById(initiatorId)
          .then((initiator) => {
            return seen.includes(initiator.managerId);
          })
          .catch((reason) => {
            console.log(reason);
            return false;
          });
      case SigningPositions.DEPARTMENT_HEAD:
        return this.positionService
          .getPositionById(initiatorId)
          .then((initiator) => {
            return this.departmentService.getDepartmentById(
              initiator.departmentId,
            );
          })
          .then((department) => {
            return seen.includes(department.departmentHeadId);
          })
          .catch((reason) => {
            console.log(reason);
            return false;
          });
      case SigningPositions.LEADERSHIP_TEAM:
        return this.positionService
          .getPositionById(initiatorId)
          .then((initiator) => {
            return this.departmentService.getDepartmentById(
              initiator.departmentId,
            );
          })
          .then((department) => {
            return seen.includes(department.leadershipTeamMemberId);
          })
          .catch((reason) => {
            console.log(reason);
            return false;
          });
      default:
        return false;
    }
  }
}
