import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export const useBucket = () => {
  const s3 = new S3Client({
    region: process.env.S3_UPLOAD_REGION as string,
    credentials: {
      accessKeyId: process.env.S3_UPLOAD_KEY as string,
      secretAccessKey: process.env.S3_UPLOAD_SECRET as string,
    },
  });

  const uploadFile = async (file: File, key: string) => {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_UPLOAD_BUCKET as string,
      Key: key,
      Body: file,
    });

    try {
      const response = await s3.send(command);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  return {
    uploadFile,
  }
}