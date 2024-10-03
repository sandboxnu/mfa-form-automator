import { FormInstanceEntity, FormTemplateEntity } from '@web/client';
import { useEffect, useState } from 'react';
import { storage } from './../services/storage.service';

/**
 * @param form - the form instance or form template
 * @returns an object containing the form blob and form URL
 */
export const useStorage = (
  form: FormInstanceEntity | FormTemplateEntity | null,
) => {
  const [formBlob, setFormBlob] = useState<Blob | null>(null);
  const [formURL, setFormURL] = useState<string | null>(null);

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

  useEffect(() => {
    if (formBlob && formBlob.size > 0) {
      const url = URL.createObjectURL(formBlob);
      // let url = 'http://localhost:3002/test.pdf';
      setFormURL(url);
    }
  }, [formBlob]);

  return {
    formBlob,
    formURL,
  };
};
