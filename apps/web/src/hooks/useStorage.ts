import { ContainerClient } from '@azure/storage-blob';

export const useStorage = () => {
  const blobServiceClient = new ContainerClient(
    process.env.STORAGE_BLOB_URL as string,
  );

  async function uploadBlob(file: File, blobName: string) {
    const blockBlobClient = blobServiceClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(file);
  }

  return { uploadBlob };
};
