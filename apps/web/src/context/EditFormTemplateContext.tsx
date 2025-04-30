import React, { createContext, useContext, useState } from 'react';
import { EditFormTemplateContextType } from './types';
import {
  FormFields,
  FieldGroups,
} from '@web/components/createFormTemplate/types';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { groupColors } from '@web/utils/formTemplateUtils';
import { v4 as uuidv4 } from 'uuid';
import { useQuery } from '@tanstack/react-query';
import { formTemplatesControllerFindOneOptions } from '@web/client/@tanstack/react-query.gen';
import {
  fetchPdfFile,
  formEditorTranslateFieldGroups,
  formEditorTranslateFormFields,
} from '@web/utils/formInstanceUtils';

export const EditFormTemplateContext =
  createContext<EditFormTemplateContextType>({} as EditFormTemplateContextType);

export const EditFormTemplateProvider = ({ children }: any) => {
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
  const [isLoadingEditContext, setIsLoadingEditContext] =
    useState<boolean>(true);

  const [formDimensions, setFormDimensions] = useState<{
    width: number;
    height: number;
  }>();
  const [formTemplateUseId, setFormTemplateUseId] = useState<string | null>(
    null,
  );

  const router = useRouter();

  const { data: formTemplateData, isLoading: isLoadingFormTemplate } = useQuery(
    {
      ...formTemplatesControllerFindOneOptions({
        path: {
          id: (router.query.id as string) || '',
        },
      }),
      enabled: !!router.query.id,
    },
  );

  useEffect(() => {
    if (formTemplateData) {
      fetchPdfFile(setPdfFile, formTemplateData.formDocLink)
        .then(() => {
          setFormTemplateName(formTemplateData.name);
          setFormTemplateDescription(formTemplateData.description);
          setFormFields(
            formEditorTranslateFormFields(formTemplateData.fieldGroups),
          );
          setFieldGroups(
            formEditorTranslateFieldGroups(formTemplateData.fieldGroups),
          );
          setFormDimensions({
            width: formTemplateData.pageWidth,
            height: formTemplateData.pageHeight,
          });
          setFormTemplateUseId(formTemplateData.id);
        })
        .finally(() => {
          setIsLoadingEditContext(false);
        });
    }
  }, [formTemplateData]);

  useEffect(() => {
    if (!pdfFile && router.pathname !== '/template-directory') {
      router.push('/template-directory');
    }
  }, [pdfFile, router]);

  return (
    <EditFormTemplateContext.Provider
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
        isLoadingEditContext: isLoadingFormTemplate || isLoadingEditContext,
      }}
    >
      {children}
    </EditFormTemplateContext.Provider>
  );
};

export const useEditFormTemplate = () => useContext(EditFormTemplateContext);
