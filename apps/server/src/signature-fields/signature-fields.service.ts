import { Injectable } from '@nestjs/common';
import { CreateSignatureFieldDto } from './dto/create-signature-field.dto';
import { UpdateSignatureFieldDto } from './dto/update-signature-field.dto';

@Injectable()
export class SignatureFieldsService {
  create(createSignatureFieldDto: CreateSignatureFieldDto) {
    return 'This action adds a new signatureField';
  }

  findAll() {
    return `This action returns all signatureFields`;
  }

  findOne(id: number) {
    return `This action returns a #${id} signatureField`;
  }

  update(id: number, updateSignatureFieldDto: UpdateSignatureFieldDto) {
    return `This action updates a #${id} signatureField`;
  }

  remove(id: number) {
    return `This action removes a #${id} signatureField`;
  }
}
