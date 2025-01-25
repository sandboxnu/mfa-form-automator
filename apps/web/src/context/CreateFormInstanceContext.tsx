import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { CreateFormInstanceContextType } from './types';
import { FormTemplateEntity } from '@web/client';

export const CreateFormInstanceContext =
  createContext<CreateFormInstanceContextType>(
    {} as CreateFormInstanceContextType,
  );

export const CreateFormInstanceProvider = ({ children }: any) => {
  const [formInstanceName, setFormInstanceName] = useState<string | null>(null);
  const [formInstanceDescription, setFormInstanceDescription] = useState<
    string | null
  >(null);
  const [formTemplate, setFormTemplate] = useState<FormTemplateEntity | null>(
    null,
  );

  const router = useRouter();

  useEffect(() => {
    if (
      !formTemplate &&
      router.pathname !== '/create-instance/select-template'
    ) {
      router.push('/create-instance/select-template');
    }
  });

  return (
    <CreateFormInstanceContext.Provider
      value={{
        formInstanceName,
        formInstanceDescription,
        setFormInstanceName,
        setFormInstanceDescription,
        formTemplate,
        setFormTemplate,
      }}
    >
      {children}
    </CreateFormInstanceContext.Provider>
  );
};

export const useCreateFormInstance = () =>
  useContext(CreateFormInstanceContext);
