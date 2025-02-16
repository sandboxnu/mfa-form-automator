import React, { createContext, useContext, useState } from 'react';
import { CreateFormTemplateContextType } from './types';
import { useBlob } from '@web/hooks/useBlob';
import {
  FormFields,
  FieldGroups,
} from '@web/components/createFormTemplate/types';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const CreateFormTemplateContext =
  createContext<CreateFormTemplateContextType>(
    {} as CreateFormTemplateContextType,
  );

export const CreateFormTemplateProvider = ({ children }: any) => {
  const blobHook = useBlob();
  const [formTemplateName, setFormTemplateName] = useState<string | null>(null);
  const [formTemplateDescription, setFormTemplateDescription] = useState<
    string | null
  >(null);
  const [formFields, setFormFields] = useState<FormFields>({});
  const [fieldGroups, setFieldGroups] = useState<FieldGroups>(new Map());
  
  const router = useRouter();

  useEffect(() => {
    if (
      !blobHook.localBlobData.url &&
      router.pathname !== '/create-template/upload'
    ) {
      router.push('/create-template/upload');
    }
  }, [blobHook.localBlobData.url, router]);

  return (
    <CreateFormTemplateContext.Provider
      value={{
        formTemplateName,
        formTemplateDescription,
        setFormTemplateName,
        setFormTemplateDescription,
        useBlob: blobHook,
        formFields,
        setFormFields,
        fieldGroups,
        setFieldGroups,
      }}
    >
      {children}
    </CreateFormTemplateContext.Provider>
  );
};

export const useCreateFormTemplate = () =>
  useContext(CreateFormTemplateContext);
