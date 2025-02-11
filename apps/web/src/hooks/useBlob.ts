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
  const [blob, setBlob] = useState<File | null>(null);

  return {
    inputFileRef,
    blob,
    setBlob,
  };
};
