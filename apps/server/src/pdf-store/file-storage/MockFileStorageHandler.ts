import { FileStorageHandler } from './FileStorageHandlerInterface';

export class MockFileStorageHandler implements FileStorageHandler {
  async uploadFile(_: Buffer, __: string, ___: string) {
    return 'https://example.com';
  }
  async deleteFile(_: string) {
    return;
  }
}
