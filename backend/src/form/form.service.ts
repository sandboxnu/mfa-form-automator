import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from 'src/models/form.entity';
import { SignatureChainService } from 'src/signatureChain/signatureChain.service';
import { Repository } from 'typeorm';
import { CreateFormDto, FormDto } from './form.dto';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form) private formRepository: Repository<Form>,
    @Inject(SignatureChainService)
    private signatureChainLinkService: SignatureChainService,
  ) {}

  async createForm(createFormDto: CreateFormDto) {
    const formDto: FormDto = {
      name: createFormDto.name,
      pdfLink: createFormDto.pdfLink,
      signatureChainLinkHead: null,
      formInstances: [],
    };
    const form: Form = this.formRepository.create(formDto);

    form.signatureChainLinkHead =
      await this.signatureChainLinkService.createSignatureChain({
        formId: form.id,
        signatureChainLinks: createFormDto.signatureChainLinks,
      });

    return this.formRepository.save(form);
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
