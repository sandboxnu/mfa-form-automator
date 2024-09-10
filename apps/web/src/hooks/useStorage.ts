import { FormInstanceEntity, FormTemplateEntity } from '@web/client';
import { useEffect, useState } from 'react';
import { storage } from './../services/storage.service';

/**
 * @param form - Form instance or form template
 * @returns Form blob for the form instance or form template
 */
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
