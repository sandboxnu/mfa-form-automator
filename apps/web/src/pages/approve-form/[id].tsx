import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/approveFormInstance/ReviewBox';
import isAuth from '@web/components/isAuth';
import { useApproveFormInstance } from '@web/hooks/useApproveFormInstance';
import { fetchPdfFile } from '@web/utils/formInstanceUtils';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import {
  formInstancesControllerCompleteFormInstanceMutation,
  formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey,
  formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey,
  formInstancesControllerFindAllQueryKey,
} from '@web/client/@tanstack/react-query.gen';
import { queryClient } from '../_app';

function ReviewAndApproveForm() {
  const { formInstance, completedPdfLink } = useApproveFormInstance();
  const router = useRouter();
  const [completedPdfFile, setCompletedPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const completeFormInstanceMutation = useMutation({
    ...formInstancesControllerCompleteFormInstanceMutation(),
    onMutate: () => {
      setIsLoading(true);
    },
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

      router.push('/approve-form/success').then(() => {
        setIsLoading(false);
      });
    },
  });

  useEffect(() => {
    fetchPdfFile(setCompletedPdfFile, completedPdfLink);
  }, [completedPdfLink]);

  if (!formInstance) {
    return <></>;
  }

  const handleApproveFormInstance = async () => {
    await completeFormInstanceMutation.mutateAsync({
      path: {
        formInstanceId: formInstance?.id,
      },
    });
  };

  return (
    <FormLayout
      type={FormInteractionType.ApproveFormInstance}
      pageNumber={1}
      heading={'Mark Completed'}
      subheading={'Review and Approve the completed form'}
      boxContent={
        <ReviewBox
          dimensions={{
            width: formInstance?.formTemplate.pageWidth,
            height: formInstance?.formTemplate.pageHeight,
          }}
          pdfFile={completedPdfFile}
          fieldGroups={[]}
          name={formInstance?.name ?? ''}
          description={formInstance?.description ?? ''}
        />
      }
      submitFunction={handleApproveFormInstance}
      backLink={'/'}
      review={true}
      disabled={isLoading}
      loading={isLoading}
    />
  );
}

export default isAuth(ReviewAndApproveForm);
