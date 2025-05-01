import React, { createContext, useContext, useState } from 'react';
import { CreateFormTemplateContextType } from './types';
import {
  FormFields,
  FieldGroups,
} from '@web/components/createFormTemplate/types';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { groupColors } from '@web/utils/formTemplateUtils';
import { v4 as uuidv4 } from 'uuid';

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
  const [fieldGroups, setFieldGroups] = useState<FieldGroups>(
    new Map().set(uuidv4(), {
      border: groupColors[0][0],
      background: groupColors[0][1],
      groupName: `Group ${1}`,
    }),
  );

  const [formDimensions, setFormDimensions] = useState<{
    width: number;
    height: number;
  }>();

  const router = useRouter();

  useEffect(() => {
    if (!pdfFile && router.pathname !== '/form-template/create/upload') {
      router.push('/form-template/create/upload');
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
      }}
    >
      {children}
    </CreateFormTemplateContext.Provider>
  );
};

export const useCreateFormTemplate = () =>
  useContext(CreateFormTemplateContext);
