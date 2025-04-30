import { useMutation, useQuery } from '@tanstack/react-query';
import {
  formInstancesControllerCompleteFormInstanceMutation,
  formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey,
  formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey,
  formInstancesControllerFindAllQueryKey,
  formInstancesControllerFindOneOptions,
} from '@web/client/@tanstack/react-query.gen';
import { ApproveFormInstanceContextType } from '@web/context/types';
import { useAuth } from '@web/hooks/useAuth';
import { queryClient } from '@web/pages/_app';
import { getLatestSignedFormLink } from '@web/utils/formInstanceUtils';
import { useRouter } from 'next/router';
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
  const [completedPdfLink, setCompletedPdfLink] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!formInstance || formInstanceError) return;
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
        approvePdf,
        formInstance,
      }}
    >
      {children}
    </ApproveFormInstanceContext.Provider>
  );
};
