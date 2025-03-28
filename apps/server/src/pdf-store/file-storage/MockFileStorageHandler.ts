import { FileStorageHandler } from './FileStorageHandlerInterface';

export class MockFileStorageHandler implements FileStorageHandler {
  async uploadFile(file: Buffer, fileName: string, fileExtension: string) {
    console.log('Mock upload file:', fileName, fileExtension, file);
    return 'https://example.com';
  }
  async deleteFile(fileName: string) {
    console.log('Mock delete file:', fileName);
    return;
  }
}
