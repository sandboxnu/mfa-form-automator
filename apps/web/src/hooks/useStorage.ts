import { FormInstanceEntity, FormTemplateEntity } from '@web/client';
import { useEffect, useState } from 'react';
import { mockStorage } from './../services/storage.service';

// hook to fetch form blob from storage
export const useStorage = (
  form: FormInstanceEntity | FormTemplateEntity | null,
) => {
  const [formBlob, setFormBlob] = useState<Blob | null>(null);
  const [mockBlob, setMockBlob] = useState<Blob | null>(null);

  // This needs to be uncommented once storage is set up
  // useEffect(() => {
  //   async function fetchFormBlob() {
  //     const blob = (await storage.downloadBlob(form?.formDocLink!)) as Blob;
  //     const arrayBuffer = await blob.arrayBuffer();
  //     setFormBlob(new Blob([arrayBuffer], { type: 'application/pdf' }));
  //   }

  //   async function fetchMockBlob() {}

  //   if (form) {
  //     fetchFormBlob();
  //   }
  // }, [form]);

  useEffect(() => {
    async function fetchMockBlob() {
      const blob = (await mockStorage.downloadBlob('mockBlobLink')) as Blob;
      const arrayBuffer = await blob.arrayBuffer();
      setMockBlob(new Blob([arrayBuffer], { type: 'application/pdf' }));
    }

    fetchMockBlob();
  }, [form]);

  return {
    formBlob,
    mockBlob,
  };
};
