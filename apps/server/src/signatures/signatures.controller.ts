import { Body, Controller, Param, Patch } from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { UpdateSignatureSignerDto } from './dto/update-signature-signer.dto';

@Controller('signatures')
export class SignaturesController {
  constructor(private readonly signaturesService: SignaturesService) {}

  @Patch(':id/signer')
  updateSignatureSigner(
    @Param('id') id: string,
    @Body() updateSignatureSignerDto: UpdateSignatureSignerDto,
  ) {
    return this.signaturesService.updateSigner(id, updateSignatureSignerDto);
  }
}
