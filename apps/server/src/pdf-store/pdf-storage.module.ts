import { Module } from '@nestjs/common';
import { PdfStoreService } from './pdf-store.service';
import { VercelFileStorageHandler } from './file-storage/VercelFileStorageHandler';

@Module({
  providers: [
    PdfStoreService,
    {
      provide: 'FileStorageHandler',
      useClass: VercelFileStorageHandler,
    },
  ],
  exports: [PdfStoreService],
})
export class PdfStoreModule {}
