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

class MockBlobStorage {
  async uploadBlob(file: File, blobName: string) {
    console.log('Uploading Blob', blobName);
  }

  async downloadBlob(blobLink: string) {
    console.log('Downloading Blob', blobLink);

    async function downloadBlob(blobLink: string) {
      const response = await fetch(blobLink);
      const blob = await response.blob();
      return blob;
    }

    const blob = await downloadBlob(
      'https://s29.q4cdn.com/175625835/files/doc_downloads/test.pdf',
    );
    return blob;
  }
}

const storage = new BlobStorage(process.env.STORAGE_BLOB_URL as string);
const mockStorage = new MockBlobStorage();
export { storage, mockStorage };
