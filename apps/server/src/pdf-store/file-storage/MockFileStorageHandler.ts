import { FileStorageHandler } from './FileStorageHandlerInterface';

export class MockFileStorageHandler implements FileStorageHandler {
  async uploadFile(_: Buffer, __: string, ___: string) {
    return Promise.resolve('mocked-file-url');
  }

  async deleteFile(_: string): Promise<void> {
    return Promise.resolve();
  }
}
