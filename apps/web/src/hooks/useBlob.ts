import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';
import { type PutBlobResult } from '@vercel/blob';

type LocalBlobData = {
  blob: Blob | null;
  url: string | null;
  name: string | null;
  size: string | null;
};

// https://vercel.com/docs/storage/vercel-blob/client-upload
export const useBlob = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [hasLocalBlob, setHasLocalBlob] = useState<boolean>(false);

  const [localBlobData, setLocalBlobData] = useState<LocalBlobData>({
    blob: null,
    url: null,
    name: null,
    size: null,
  });

  const uploadLocalFile = (file: File | undefined) => {
    if (file) {
      const blob: Blob = new Blob([file], { type: file.type });
      const url = URL.createObjectURL(blob);
      setLocalBlobData({
        blob,
        url,
        name: file.name,
        size: (file.size / 1000000).toFixed(2),
      });
      setHasLocalBlob(true);
    }
  };

  const clearLocalBlob = () => {
    setLocalBlobData({
      blob: null,
      url: null,
      name: null,
      size: null,
    });
    setHasLocalBlob(false);
  };

  const uploadFile = async (file: File) => {
    const newBlob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: '/api/upload',
    });

    setBlob(newBlob);
    return newBlob;
  };

  const uploadLocalBlobData = async () => {
    if (!localBlobData.blob) {
      throw new Error('No file selected');
    }

    const file: File = new File(
      [localBlobData.blob],
      localBlobData.name || 'file.pdf',
      {
        type: 'application/pdf',
      },
    );

    console.log('file', file);

    return uploadFile(file);
  };

  const uploadFileRef = async () => {
    if (!inputFileRef.current?.files) {
      throw new Error('No file selected');
    }

    const file = inputFileRef.current.files[0];
    return uploadFile(file);
  };

  return {
    inputFileRef,
    blob,
    localBlobData,
    uploadFileRef,
    uploadFile,
    uploadLocalFile,
    clearLocalBlob,
    hasLocalBlob,
    uploadLocalBlobData,
  };
};
