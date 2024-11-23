import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';
import { type PutBlobResult } from '@vercel/blob';
import { FormInstanceEntity, FormTemplateEntity } from '@web/client';

type LocalBlobData = {
  blob: Blob | null;
  url: string | null;
  name: string | null;
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
  });

  const uploadLocalFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const inputElement = event.target;

    const file = inputElement?.files?.[0];

    if (file) {
      const blob: Blob = new Blob([file], { type: file.type });
      const url = URL.createObjectURL(blob);
      setLocalBlobData({
        blob,
        url,
        name: file.name,
      });
      setHasLocalBlob(true);
    }
  };

  const clearLocalBlob = () => {
    setLocalBlobData({
      blob: null,
      url: null,
      name: null,
    });
    setHasLocalBlob(false);
  };

  const uploadFile = async (
    form: FormTemplateEntity | FormInstanceEntity,
    formType: 'template' | 'instance',
  ) => {
    if (!inputFileRef.current?.files) {
      throw new Error('No file selected');
    }

    const file = inputFileRef.current.files[0];
    const newBlob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: 'api/upload',
      clientPayload: JSON.stringify({
        formId: form?.id,
        formType,
      }),
    });

    setBlob(newBlob);
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
