import { FileStorageHandler } from './FileStorageHandlerInterface';
import { ContainerClient } from '@azure/storage-blob';

const BASE_PATH = 'mfa/forms';
const CONTAINER_NAME = 'mfa-forms';

export class AzureFileStorageHandler implements FileStorageHandler {
  private readonly connectionString: string;
  constructor() {
    this.connectionString = process.env
      .AZURE_STORAGE_CONNECTION_STRING as string;
    if (!this.connectionString)
      throw Error('Azure Storage connectionString not found');
  }

  async uploadFile(file: Buffer, fileName: string, fileExtension: string) {
    try {
      const path = `${BASE_PATH}/${fileName}.${fileExtension}`;
      const containerClient = new ContainerClient(
        this.connectionString,
        CONTAINER_NAME,
      );
      await containerClient.createIfNotExists();
      const blockBlobClient = containerClient.getBlockBlobClient(path);
      await blockBlobClient.uploadData(file, {
        blobHTTPHeaders: { blobContentType: 'application/pdf' },
      });
      return blockBlobClient.url;
    } catch (e) {
      console.log('error:', e);
      throw e;
    }
  }
  async deleteFile(fileName: string) {
    const path = `${BASE_PATH}/${fileName}`;
    const blockBlobClient = new ContainerClient(
      this.connectionString,
      CONTAINER_NAME,
    ).getBlockBlobClient(path);
    await blockBlobClient.delete();
  }
}
