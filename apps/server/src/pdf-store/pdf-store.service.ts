import { Inject, Injectable } from '@nestjs/common';
import { FileStorageHandler } from './file-storage/FileStorageHandlerInterface';

@Injectable()
export class PdfStoreService {
  constructor(
    @Inject('FileStorageHandler')
    private fileStorageHandler: FileStorageHandler,
  ) {}

  async uploadPdf(file: Buffer, fileName: string) {
    const fileUrl = await this.fileStorageHandler.uploadFile(
      file,
      fileName,
      'pdf',
    );
    return fileUrl;
  }
}
