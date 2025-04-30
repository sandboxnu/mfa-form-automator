import { useMutation, useQuery } from '@tanstack/react-query';
import {
  formInstancesControllerCompleteFormInstanceMutation,
  formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey,
  formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey,
  formInstancesControllerFindAllQueryKey,
  formInstancesControllerFindOneOptions,
  formInstancesControllerSignFormInstanceMutation,
} from '@web/client/@tanstack/react-query.gen';
import {
  ApproveFormInstanceContextType,
  ContextAssignedGroupData,
  FormField,
} from '@web/context/types';
import { useAuth } from '@web/hooks/useAuth';
import { queryClient } from '@web/pages/_app';
import { getLatestSignedFormLink } from '@web/utils/formInstanceUtils';
import { groupRgbColors } from '@web/utils/formTemplateUtils';
import { useRouter } from 'next/router';
import { PDFCheckBox, PDFDocument, PDFTextField, rgb } from 'pdf-lib';
import React, { createContext, useEffect, useState } from 'react';

export const ApproveFormInstanceContext =
  createContext<ApproveFormInstanceContextType>(
    {} as ApproveFormInstanceContextType,
  );

export const ApproveFormInstanceProvider = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { user } = useAuth();

  const {
    data: formInstance,
    error: formInstanceError,
    isLoading,
  } = useQuery({
    ...formInstancesControllerFindOneOptions({
      path: {
        id: id,
      },
    }),

    enabled: !!id,
    retry: (failureCount, error) => {
      if (error.message === 'Request failed with status code 401') {
        return false; // Do not retry on 401 errors
      }
      return failureCount < 3; // Retry up to 3 times for other errors
    },
  });

  const completeFormInstanceMutation = useMutation({
    ...formInstancesControllerCompleteFormInstanceMutation(),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: formInstancesControllerFindAllQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey:
          formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey:
          formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey(),
      });
      router.push('/completed').then(() => {});
    },
  });

  const approvePdf = async () => {
    await completeFormInstanceMutation.mutateAsync({
      path: {
        formInstanceId: id,
      },
    });
  };
  const [fields, setFields] = useState<FormField[][]>([]);
  const [groupNumber, setGroupNumber] = useState<number>(0);
  const [previewPdfLink, setPreviewPdfLink] = useState('');
  const [completedPdfLink, setCompletedPdfLink] = useState('');
  const [completedPdf, setCompletedPdf] = useState<ArrayBuffer | null>(null);
  const [previewPdf, setPreviewPdf] = useState<ArrayBuffer | null>(null);
  const router = useRouter();

  // Fetch PDF data when links change

  useEffect(() => {
    if (!formInstance || formInstanceError) return;

    const getFields = () => {
      const assignedGroups = formInstance.assignedGroups;
      if (assignedGroups.length > 0) {
        const numPages =
          Math.max(
            ...assignedGroups.flatMap((group) =>
              group.fieldGroup.templateBoxes.map((box) => box.page),
            ),
          ) + 1;
        const fields: FormField[][] = Array.from(
          { length: numPages },
          () => [],
        );

        assignedGroups[0].fieldGroup.templateBoxes.forEach((templateBox) => {
          if (templateBox.type === 'TEXT_FIELD') {
            fields[templateBox.page].push({
              ...templateBox,
              data: {
                text: '',
              },
            });
          } else {
            fields[templateBox.page].push({
              ...templateBox,
              data: {
                filled: false,
              },
            });
          }
        });

        return fields;
      }
    };
    const fields = getFields() ?? [];
    setFields(fields);
    const pdfLink = getLatestSignedFormLink(formInstance);
    setCompletedPdfLink(pdfLink);
  }, [
    formInstance,
    formInstanceError,
    user?.departmentId,
    user?.id,
    user?.positionId,
  ]);

  return (
    <ApproveFormInstanceContext.Provider
      value={{
        formInstanceError,
        isLoading,
        completedPdfLink,
        fields,
        approvePdf,
        formInstance,
        groupNumber,
        signFormInstanceLoading: isLoading,
      }}
    >
      {children}
    </ApproveFormInstanceContext.Provider>
  );
};
