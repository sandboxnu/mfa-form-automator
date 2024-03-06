import { FormInstanceEntity, FormTemplateEntity } from '@web/client';
import { useEffect, useState } from 'react';
import storage from '@web/services/storage.service';

// hook to fetch form blob from storage
export const useStorage = (
  form: FormInstanceEntity | FormTemplateEntity | null,
) => {
  const [formBlob, setFormBlob] = useState<Blob | null>(null);
  useEffect(() => {
    async function fetchFormBlob() {
      const blob = (await storage.downloadBlob(form?.formDocLink!)) as Blob;
      const arrayBuffer = await blob.arrayBuffer();
      setFormBlob(new Blob([arrayBuffer], { type: 'application/pdf' }));
    }

    if (form) {
      fetchFormBlob();
    }
  }, [form]);
  return {
    formBlob,
  };
};
