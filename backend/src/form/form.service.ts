import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from '../models/form.entity';
import { SignatureChainService } from '../signatureChain/signatureChain.service';
import { Repository } from 'typeorm';
import { CreateFormDto, CreateFormDtoInternal } from './form.dto';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form) private formRepository: Repository<Form>,
    @Inject(SignatureChainService)
    private signatureChainLinkService: SignatureChainService,
  ) {}

  async createForm(createFormDto: CreateFormDto) {
    const formInternalDto: CreateFormDtoInternal = {
      name: createFormDto.name,
      pdfLink: createFormDto.pdfLink,
      signatureChainLinkHead: null,
      formInstances: [],
    };

    let form: Form = this.formRepository.create(formInternalDto);
    await this.formRepository.insert(form);
    const signatureChainLinkHead =
      await this.signatureChainLinkService.createSignatureChain({
        formId: form.id,
        signatureChainLinks: createFormDto.signatureChainLinks,
      });
    this.formRepository.update(
      {
        id: form.id,
      },
      {
        signatureChainLinkHeadId: signatureChainLinkHead.id,
      },
    );
    form.signatureChainLinkHeadId = signatureChainLinkHead.id;
    return form;
  }

  getFormById(formId: number) {
    return this.formRepository.find({
      where: {
        id: formId,
      },
    });
  }

  async findAllForms() {
    console.log(await this.formRepository.find());
  }
}
