import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';
import { type PutBlobResult } from '@vercel/blob';
import { FormInstanceEntity, FormTemplateEntity } from '@web/client';

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

  const uploadLocalFile = (file: File) => {
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

  const uploadFile = async () => {
    if (!inputFileRef.current?.files) {
      throw new Error('No file selected');
    }

    const file = inputFileRef.current.files[0];
    const newBlob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: 'api/upload',
    });

    setBlob(newBlob);
    return newBlob;
  };

  return {
    inputFileRef,
    blob,
    localBlobData,
    uploadFile,
    uploadLocalFile,
    clearLocalBlob,
    hasLocalBlob,
  };
};
