import { Injectable } from '@nestjs/common';
import { CreateFormInstanceDto } from './dto/create-form-instance.dto';
import { UpdateFormInstanceDto } from './dto/update-form-instance.dto';

@Injectable()
export class FormInstancesService {
  create(createFormInstanceDto: CreateFormInstanceDto) {
    return 'This action adds a new formInstance';
  }

  findAll() {
    return `This action returns all formInstances`;
  }

  findOne(id: number) {
    return `This action returns a #${id} formInstance`;
  }

  update(id: number, updateFormInstanceDto: UpdateFormInstanceDto) {
    return `This action updates a #${id} formInstance`;
  }

  remove(id: number) {
    return `This action removes a #${id} formInstance`;
  }
}
