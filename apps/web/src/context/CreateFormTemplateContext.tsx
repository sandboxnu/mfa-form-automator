import React, { createContext } from 'react';
import { CreateFormTemplateContextType } from './types';

export const CreateFormTemplateContext =
  createContext<CreateFormTemplateContextType>(
    {} as CreateFormTemplateContextType,
  );

export const CreateFormTemplateProvider = ({ children }: any) => {
  return (
    <CreateFormTemplateContext.Provider
      value={{
        formTemplateName: '',
        formTemplateDescription: '',
        localBlobData: null,
        blobInputRef: null,
        setFormTemplateName: (formTemplateName: string) => {},
        setFormTemplateDescription: (formTemplateDescription: string) => {},
      }}
    >
      {children}
    </CreateFormTemplateContext.Provider>
  );
};
