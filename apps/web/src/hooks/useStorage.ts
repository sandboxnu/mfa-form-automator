import { ContainerClient } from '@azure/storage-blob';

export const useStorage = ({ sasUrl }: { sasUrl: string }) => {
  console.log(sasUrl);
  const blobServiceClient = new ContainerClient(sasUrl);

  async function uploadBlob(file: File) {
    const blobClient = blobServiceClient.getBlobClient(file.name);
    const blockBlobClient = blobClient.getBlockBlobClient();

    await blockBlobClient.uploadData(file);
  }

  return { uploadBlob };
};
