export interface FileStorageHandler {
  uploadFile: (
    file: Buffer,
    fileName: string,
    fileExtension: string,
  ) => Promise<string>;
  deleteFile: (fileName: string) => Promise<void>;
}
