import { Module } from '@nestjs/common';
import { PdfStoreService } from './pdf-store.service';
import { AzureFileStorageHandler } from './file-storage/AzureFileStorageHandler';
import { VercelFileStorageHandler } from './file-storage/VercelFileStorageHandler';

@Module({
  providers: [
    PdfStoreService,
    {
      provide: 'FileStorageHandler',
      useClass:
        process.env.USE_VERCEL_BLOB === 'true'
          ? VercelFileStorageHandler
          : AzureFileStorageHandler,
    },
  ],
  exports: [PdfStoreService],
})
export class PdfStoreModule {}
