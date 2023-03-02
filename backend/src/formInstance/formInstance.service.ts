import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormInstance } from '../models/formInstance.entity';
import { Repository } from 'typeorm';
import { CreateFormInstanceDto, FormInstanceDto } from './formInstance.dto';
import { SignatureRequestLink } from '../models/signatureRequestLink.entity';
import { SignatureRequestChainService } from '../signatureRequestChain/signatureRequestChain.service';

@Injectable()
export class FormInstanceService {
  constructor(
    @InjectRepository(FormInstance)
    private formInstanceRepository: Repository<FormInstance>,
    @Inject(SignatureRequestChainService)
    private signatureRequestChainService: SignatureRequestChainService,
  ) {}

  public async createFormInstance(
    createFormInstanceDto: CreateFormInstanceDto,
  ) {
    const formInstanceDto: FormInstanceDto = {
      formId: createFormInstanceDto.formId,
      completed: false,
      signatureRequestHead: null,
      initiatorId: createFormInstanceDto.positionId,
    };

    // create initial form instance
    const formInstance: FormInstance =
      this.formInstanceRepository.create(formInstanceDto);

    // create new signature request chain for given form instance
    let signatureRequestHead: SignatureRequestLink =
      await this.signatureRequestChainService.createSignatureRequestChain({
        formId: createFormInstanceDto.formId,
        formInstanceId: formInstance.id,
        initiatorId: formInstance.initiatorId,
      });

    // update form instance with new signature request chain head
    formInstance.signatureRequestHeadId = signatureRequestHead.id;
    return this.formInstanceRepository.save(formInstance);
  }
}
