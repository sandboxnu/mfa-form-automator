import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { EditFormInstanceContextType } from './types';
import { FormTemplateEntity } from '@web/client';
import { ContextAssignedGroupData } from './types';
import { fetchPdfFile } from '@web/utils/formInstanceUtils';

export const EditFormInstanceContext =
  createContext<EditFormInstanceContextType>({} as EditFormInstanceContextType);

export const EditFormInstanceProvider = ({ children }: any) => {
  const [formInstanceName, setFormInstanceName] = useState<string | null>(null);
  const [formInstanceDescription, setFormInstanceDescription] = useState<
    string | null
  >(null);
  const [formTemplate, setFormTemplate] = useState<FormTemplateEntity | null>(
    null,
  );
  const [assignedGroupData, setAssignedGroupData] = useState<
    ContextAssignedGroupData[]
  >([]);
  const [formInstanceUseId, setFormInstanceUseId] = useState<string | null>(
    null,
  );
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPdfFile(setPdfFile, formTemplate?.formDocLink);
  }, [formTemplate?.formDocLink]);

  return (
    <EditFormInstanceContext.Provider
      value={{
        formInstanceName,
        formInstanceDescription,
        setFormInstanceName,
        setFormInstanceDescription,
        formTemplate,
        setFormTemplate,
        assignedGroupData: assignedGroupData,
        setAssignedGroupData: setAssignedGroupData,
        formInstanceUseId,
        setFormInstanceUseId,
        pdfFile,
      }}
    >
      {children}
    </EditFormInstanceContext.Provider>
  );
};

export const useEditFormInstance = () => useContext(EditFormInstanceContext);
