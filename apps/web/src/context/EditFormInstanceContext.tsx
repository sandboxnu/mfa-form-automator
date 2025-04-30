import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { EditFormInstanceContextType } from './types';
import {
  FormTemplateEntity,
  formTemplatesControllerFindOne,
} from '@web/client';
import { ContextAssignedGroupData } from './types';
import { fetchPdfFile } from '@web/utils/formInstanceUtils';
import { useQuery } from '@tanstack/react-query';
import { formInstancesControllerFindOneOptions } from '@web/client/@tanstack/react-query.gen';
import { useRouter } from 'next/router';

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
  const [isLoadingEditContext, setIsLoadingEditContext] =
    useState<boolean>(true);
  const router = useRouter();

  const { data: formInstanceData, isLoading: isLoadingFormInstance } = useQuery(
    {
      ...formInstancesControllerFindOneOptions({
        path: {
          id: (router.query.id as string) || '',
        },
      }),
      enabled: !!router.query.id,
    },
  );

  useEffect(() => {
    fetchPdfFile(setPdfFile, formTemplate?.formDocLink);
  }, [formTemplate?.formDocLink]);

  useEffect(() => {
    if (formInstanceData?.formTemplate?.id) {
      formTemplatesControllerFindOne({
        path: {
          id: formInstanceData?.formTemplate?.id,
        },
      })
        .then((response) => {
          if (response.data) {
            setFormTemplate(response.data);
            setFormInstanceName(formInstanceData.name);
            setFormInstanceDescription(formInstanceData.description);
            setAssignedGroupData(
              formInstanceData.assignedGroups.map((group) => {
                return {
                  name: `Group ${group.order}`,
                  order: group.order,
                  fieldGroupId: group.fieldGroup.id,
                  signerType: group.signerType,
                  signerEmployeeId: group.signerEmployee?.id ?? undefined,
                  signerPositionId: group.signerPosition?.id ?? undefined,
                  signerDepartmentId: group.signerDepartment?.id ?? undefined,
                  signerEmployeeList:
                    group.signerEmployeeList?.map((employee) => ({
                      id: employee.id,
                      name: employee.firstName + ' ' + employee.lastName,
                      email: employee.email,
                    })) ?? [],
                };
              }),
            );
          }
        })
        .finally(() => {
          setIsLoadingEditContext(false);
        });
    }
  }, [formInstanceData]);

  return (
    <EditFormInstanceContext.Provider
      value={{
        formInstanceName,
        formInstanceDescription,
        setFormInstanceName,
        setFormInstanceDescription,
        formTemplate,
        setFormTemplate,
        isLoading: isLoadingEditContext || isLoadingFormInstance,
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
