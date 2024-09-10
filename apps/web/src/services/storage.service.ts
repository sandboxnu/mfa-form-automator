import { ContainerClient } from '@azure/storage-blob';

/**
 * Class to handle blob storage operations
 */
class BlobStorage {
  blobUrl: string;

  constructor(blobUrl: string) {
    this.blobUrl = blobUrl;
  }

  /**
   * @param file - File to upload
   * @param blobName - Name of the blob
   * @sideeffect - Uploads the file to the blob storage
   * @returns - None
   */
  async uploadBlob(file: File, blobName: string) {
    try {
      const blockBlobClient = new ContainerClient(
        this.blobUrl,
      ).getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(file);
    } catch (error) {}
  }
  /**
   * @param blobLink
   * @returns - Blob
   */
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

// Create a new instance of the BlobStorage class
const storage = new BlobStorage(process.env.STORAGE_BLOB_URL as string);
export { storage };
