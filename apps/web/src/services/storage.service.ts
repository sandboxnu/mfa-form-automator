import { ContainerClient } from '@azure/storage-blob';

/**
 * BlobStorage class to handle uploading and downloading blobs
 */
class BlobStorage {
  blobUrl: string;

  constructor(blobUrl: string) {
    this.blobUrl = blobUrl;
  }

  /**
   * @param file - the file to upload
   * @param blobName - the name of the blob
   * Uploads a blob to the blob storage
   */
  async uploadBlob(file: File, blobName: string) {
    try {
      const blockBlobClient = new ContainerClient(
        this.blobUrl,
      ).getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(file);
    } catch (e) {}
  }

  /**
   * @param blobLink - the link of the blob
   * Downloads a blob from the blob storage
   */
  async downloadBlob(blobLink: string) {
    try {
      const blockBlobClient = new ContainerClient(
        this.blobUrl,
      ).getBlockBlobClient(blobLink);
      const downloadBlockBlobResponse = await blockBlobClient.download(0);
      const blob = await downloadBlockBlobResponse.blobBody;
      return blob;
    } catch (e) {
      return new Blob();
    }
  }
}

const storage = new BlobStorage(process.env.STORAGE_BLOB_URL as string);
export { storage };
