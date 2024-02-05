import { BlobServiceClient, ContainerCreateResponse, BlobUploadCommonResponse } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';

export const useStorage = () => {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  if (!accountName) throw Error("Azure Storage accountName not found");

  const azureCredential = new DefaultAzureCredential({
    tenantId: process.env.AZURE_TENANT_ID,
  });

  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    azureCredential
  ) 

  const createContainer = async (containerName: string): Promise<ContainerCreateResponse> => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const createContainerResponse = await containerClient.create();
    return createContainerResponse;
  }

  const uploadBlob = async (containerName: string, file: File): Promise<BlobUploadCommonResponse> => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = file.name;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.uploadData(file);
    return uploadBlobResponse;
  }

  const downloadBlob = async (containerName: string, blobName: string): Promise<Blob> => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const downloadBlockBlobResponse = await blobClient.download(0);
    const blobData = await downloadBlockBlobResponse.blobBody;

    if (!blobData) throw new Error("Failed to download blob data");

    return blobData;
  }

  return {
    createContainer,
    uploadBlob,
    downloadBlob,
  }
}