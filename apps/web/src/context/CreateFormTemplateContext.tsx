import React, { createContext, useContext, useState } from 'react';
import { CreateFormTemplateContextType } from './types';
import { useBlob } from '@web/hooks/useBlob';

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

  return (
    <CreateFormTemplateContext.Provider
      value={{
        formTemplateName,
        formTemplateDescription,
        setFormTemplateName,
        setFormTemplateDescription,
        useBlob: blobHook,
      }}
    >
      {children}
    </CreateFormTemplateContext.Provider>
  );
};

export const useCreateFormTemplate = () =>
  useContext(CreateFormTemplateContext);
