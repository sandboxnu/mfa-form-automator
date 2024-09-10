import { ContainerClient } from '@azure/storage-blob';

// class to handle storage operations
class BlobStorage {
  blobUrl: string;

  constructor(blobUrl: string) {
    this.blobUrl = blobUrl;
  }

  async uploadBlob(file: File, blobName: string) {
    try {
      const blockBlobClient = new ContainerClient(
        this.blobUrl,
      ).getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(file);
    } catch (error) {}
  }

  async downloadBlob(blobLink: string) {
    try {
      const blockBlobClient = new ContainerClient(
        this.blobUrl,
      ).getBlockBlobClient(blobLink);
      const downloadBlockBlobResponse = await blockBlobClient.download(0);
      const blob = await downloadBlockBlobResponse.blobBody;
      return blob;
    } catch (error) {
      return new Blob([], { type: 'application/pdf' });
    }
  }
}

const storage = new BlobStorage(process.env.STORAGE_BLOB_URL as string);
export { storage };
