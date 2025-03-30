import { Module } from '@nestjs/common';
import { PdfStoreService } from './pdf-store.service';
import { AzureFileStorageHandler } from './file-storage/AzureFileStorageHandler';

@Module({
  providers: [
    PdfStoreService,
    {
      provide: 'FileStorageHandler',
      useClass: AzureFileStorageHandler,
    },
  ],
  exports: [PdfStoreService],
})
export class PdfStoreModule {}
