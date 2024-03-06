import { ContainerClient } from '@azure/storage-blob';

// class to handle storage operations
class BlobStorage {
  blobUrl: string;

  constructor(blobUrl: string) {
    this.blobUrl = blobUrl;
  }

  async uploadBlob(file: File, blobName: string) {
    const blockBlobClient = new ContainerClient(
      this.blobUrl,
    ).getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(file);
  }

  async downloadBlob(blobLink: string) {
    const blockBlobClient = new ContainerClient(
      this.blobUrl,
    ).getBlockBlobClient(blobLink);
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const blob = await downloadBlockBlobResponse.blobBody;
    return blob;
  }
}

const storage = new BlobStorage(process.env.STORAGE_BLOB_URL as string);
export default storage;
