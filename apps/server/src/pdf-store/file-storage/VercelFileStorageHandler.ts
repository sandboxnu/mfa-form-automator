import { Injectable } from '@nestjs/common';
import { FileStorageHandler } from './FileStorageHandlerInterface';
import { put, del } from '@vercel/blob';

const BASE_PATH = 'mfa/forms';

@Injectable()
export class VercelFileStorageHandler implements FileStorageHandler {
  async uploadFile(
    file: Buffer,
    fileName: string,
    fileExtension: string,
  ): Promise<string> {
    const blob = await put(`${BASE_PATH}/${fileName}.${fileExtension}`, file, {
      access: 'public',
      multipart: true,
    });
    return blob.url;
  }

  async deleteFile(fileName: string): Promise<void> {
    del(`${BASE_PATH}/${fileName}`, {});
    return;
  }
}
