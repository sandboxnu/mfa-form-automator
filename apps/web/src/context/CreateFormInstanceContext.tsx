import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { CreateFormInstanceContextType } from './types';
import { FormTemplateEntity } from '@web/client';
import { Option } from 'apps/web/src/components/createFormInstance/types'

export const CreateFormInstanceContext =
  createContext<CreateFormInstanceContextType>(
    {} as CreateFormInstanceContextType,
  );

export const CreateFormInstanceProvider = ({ children }: any) => {
  const [formInstanceName, setFormInstanceName] = useState<string | null>(null);
  const [formInstanceDescription, setFormInstanceDescription] = useState<
    string | null>(null);
  const [formTemplate, setFormTemplate] = useState<FormTemplateEntity | null>(null);
  const [signaturePositions, setSignaturePositions] = useState<
  (Option | null)[]>([]); 
  

  const router = useRouter();

  useEffect(() => {
    if (!formTemplate && router.pathname !== '/create-instance/select-template') {
      router.push('/create-instance/select-template');
    }
  }, [formTemplate, router.pathname]);

  return (
    <CreateFormInstanceContext.Provider
      value={{
        formInstanceName,
        formInstanceDescription,
        setFormInstanceName,
        setFormInstanceDescription,
        formTemplate,
        setFormTemplate,
        signaturePositions,
        setSignaturePositions,
      }}
    >
      {children}
    </CreateFormInstanceContext.Provider>
  );
};

export const useCreateFormInstance = () =>
  useContext(CreateFormInstanceContext);
