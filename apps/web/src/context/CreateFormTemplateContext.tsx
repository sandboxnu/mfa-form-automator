import React, { createContext, useContext, useState } from 'react';
import { CreateFormTemplateContextType } from './types';
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
  const [formTemplateName, setFormTemplateName] = useState<string | null>(null);
  const [formTemplateDescription, setFormTemplateDescription] = useState<
    string | null
  >(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [formFields, setFormFields] = useState<FormFields>({});
  const [fieldGroups, setFieldGroups] = useState<FieldGroups>(new Map());
  const [formDimensions, setFormDimensions] = useState<{
    width: number;
    height: number;
  }>();
  const [formTemplateUseId, setFormTemplateUseId] = useState<string | null>(
    null,
  );

  const router = useRouter();

  useEffect(() => {
    if (
      !pdfFile &&
      router.pathname !== '/create-template/upload' &&
      router.pathname !== '/template-directory'
    ) {
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
        formDimensions,
        setFormDimensions,
        formTemplateUseId,
        setFormTemplateUseId,
      }}
    >
      {children}
    </CreateFormTemplateContext.Provider>
  );
};

export const useCreateFormTemplate = () =>
  useContext(CreateFormTemplateContext);
