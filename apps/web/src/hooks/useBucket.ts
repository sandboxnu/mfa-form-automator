import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export const useBucket = () => {
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });


  const uploadFile = async (file: File) => {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: file.name,
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