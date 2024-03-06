import { ContainerClient } from '@azure/storage-blob';

export const useStorage = () => {
  const blobServiceClient = new ContainerClient(
    process.env.STORAGE_BLOB_URL as string,
  );

  async function uploadBlob(file: File, blobName: string) {
    const blockBlobClient = blobServiceClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(file);
  }

  async function downloadBlob(blobLink: string) {
    const blockBlobClient = blobServiceClient.getBlockBlobClient(blobLink);
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const blob = await downloadBlockBlobResponse.blobBody;
    console.log(blob);
    return blob;
  }

  return { uploadBlob, downloadBlob };
};
