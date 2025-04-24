import { useMutation } from '@tanstack/react-query';
import {
  formInstancesControllerUpdateMutation,
  formTemplatesControllerFindAllQueryKey,
} from '@web/client/@tanstack/react-query.gen';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/createFormInstance/ReviewBox';
import isAuth from '@web/components/isAuth';
import { toaster } from '@web/components/ui/toaster';
import { useEditFormInstance } from '@web/context/EditFormInstanceContext';
import { useAuth } from '@web/hooks/useAuth';
import { queryClient } from '@web/pages/_app';
import { useRouter } from 'next/router';
import { useState } from 'react';

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
        queryKey: formTemplatesControllerFindAllQueryKey(),
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
          id: '',
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
        toaster.create({
          title: 'Failed to create form instance',
          description: (e as Error).message,
          type: 'error',
          duration: 3000,
        });
        throw e;
      });
  };

  return (
    <FormLayout
      type={FormInteractionType.EditFormInstance}
      pageNumber={4}
      heading={'Edit form instance'}
      subheading={'Review your form instance'}
      boxContent={
        <ReviewBox
          pdfFile={pdfFile}
          name={formInstanceName ?? ''}
          description={formInstanceDescription ?? ''}
          fieldGroups={formTemplate?.fieldGroups ?? []}
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
