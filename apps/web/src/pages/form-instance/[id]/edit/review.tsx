import { useMutation } from '@tanstack/react-query';
import {
  formInstancesControllerFindAllInfiniteQueryKey,
  formInstancesControllerFindAllQueryKey,
  formInstancesControllerUpdateMutation,
} from '@web/client/@tanstack/react-query.gen';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/createFormInstance/ReviewBox';
import isAuth from '@web/components/isAuth';
import { toaster } from '@web/components/ui/toaster';
import { useEditFormInstance } from '@web/context/EditFormInstanceContext';
import { useAuth } from '@web/hooks/useAuth';
import { queryClient } from '@web/pages/_app';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Error from '@web/components/Error';

function Review() {
  const {
    formInstanceName,
    formInstanceDescription,
    formTemplate,
    assignedGroupData,
    formInstanceUseId,
    pdfFile,
  } = useEditFormInstance();
  const router = useRouter();
  const updateFormInstanceMutation = useMutation({
    ...formInstancesControllerUpdateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formInstancesControllerFindAllQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: formInstancesControllerFindAllInfiniteQueryKey(),
      });
    },
  });
  const { user } = useAuth();
  const [createFormLoading, setCreateFormLoading] = useState(false);

  const _submitFormInstance = async () => {
    if (
      !formTemplate ||
      !assignedGroupData ||
      !user ||
      assignedGroupData.length != formTemplate.fieldGroups.length ||
      createFormLoading
    ) {
      return;
    }

    setCreateFormLoading(true);

    await updateFormInstanceMutation
      .mutateAsync({
        body: {
          name: formInstanceName ?? formTemplate.name ?? '',
          description:
            formInstanceDescription ?? formTemplate.description ?? '',
          assignedGroups: assignedGroupData,
        },
        path: {
          id: formInstanceUseId!!,
        },
      })
      .then(async (response) => {
        router
          .push('/form-instance/' + formInstanceUseId + '/edit/success')
          .then(() => {
            setCreateFormLoading(false);
          });
        return response;
      })
      .catch((e) => {
        setCreateFormLoading(false);
        if (e instanceof AxiosError) {
          toaster.create({
            title: 'Failed to edit form instance',
            description: e.response?.data.message ?? e.message,
            type: 'error',
            duration: 3000,
          });
        } else {
          toaster.create({
            title: 'Failed to edit form instance',
            description: (e as Error).message,
            type: 'error',
            duration: 3000,
          });
        }
      });
  };

  if (!formTemplate) {
    return <Error secondaryErrorMessage="Error editing instance" />;
  }

  return (
    <FormLayout
      type={FormInteractionType.EditFormInstance}
      pageNumber={4}
      heading={'Edit form instance'}
      subheading={'Review your form instance'}
      boxContent={
        <ReviewBox
          assignedGroupData={assignedGroupData}
          pdfFile={pdfFile}
          name={formInstanceName ?? ''}
          description={formInstanceDescription ?? ''}
          fieldGroups={formTemplate?.fieldGroups ?? []}
          formTemplate={formTemplate}
        />
      }
      submitFunction={_submitFormInstance}
      backLink={'/form-instance/' + formInstanceUseId + '/edit/assign-groups'}
      review={true}
      disabled={createFormLoading}
      loading={createFormLoading}
    />
  );
}

export default isAuth(Review);
