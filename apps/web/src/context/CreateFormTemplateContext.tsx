import React, { createContext, useContext, useState } from 'react';
import { CreateFormTemplateContextType } from './types';
import {
  FormFields,
  FieldGroups,
} from '@web/components/createFormTemplate/createFormTemplateEditor/FormEditor';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const CreateFormTemplateContext =
  createContext<CreateFormTemplateContextType>(
    {} as CreateFormTemplateContextType,
  );

export const CreateFormTemplateProvider = ({ children }: any) => {
  const [formTemplateName, setFormTemplateName] = useState<string | null>(null);
  const [formTemplateDescription, setFormTemplateDescription] = useState<
    string | null
  >(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [formFields, setFormFields] = useState<FormFields>({});
  const [fieldGroups, setFieldGroups] = useState<FieldGroups>(new Map());
  const router = useRouter();

  useEffect(() => {
    if (!pdfFile && router.pathname !== '/create-template/upload') {
      router.push('/create-template/upload');
    }
  }, [pdfFile, router]);

  return (
    <CreateFormTemplateContext.Provider
      value={{
        formTemplateName,
        formTemplateDescription,
        setFormTemplateName,
        setFormTemplateDescription,
        pdfFile: pdfFile,
        setPdfFile: setPdfFile,
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
