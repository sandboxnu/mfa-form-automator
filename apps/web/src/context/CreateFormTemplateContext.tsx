import React, { createContext, useContext, useState } from 'react';
import { CreateFormTemplateContextType } from './types';
import { useBlob } from '@web/hooks/useBlob';
import {
  FieldGroups,
  FormFields,
} from '@web/components/createFormTemplate/createFormTemplateEditor/FormEditor';

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
  const [formFields, setFormFields] = useState<FormFields>([]);
  const [fieldGroups, setFieldGroups] = useState<FieldGroups>(new Map());

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
