import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from '../models/form.entity';
import { Repository } from 'typeorm';
import { CreateFormDto, FormDto } from './form.dto';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form) private formRepository: Repository<Form>,
  ) {}

  createForm(createFormDto: CreateFormDto) {
    //TODO signatureChanLinkHead should be built out
    const formDto: FormDto = {
      name: createFormDto.name,
      pdfLink: createFormDto.pdfLink,
      signatureChainLinkHead: null,
      formInstances: [],
    };

    const form: Form = this.formRepository.create(formDto);
    return this.formRepository.save(form);
  }

  async findAllForms() {
    console.log(await this.formRepository.find());
  }
}
