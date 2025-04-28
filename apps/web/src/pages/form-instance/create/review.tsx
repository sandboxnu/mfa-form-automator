import { useMutation } from '@tanstack/react-query';
import {
  formInstancesControllerCreateMutation,
  formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey,
  formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey,
  formInstancesControllerFindAllQueryKey,
} from '@web/client/@tanstack/react-query.gen';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/createFormInstance/ReviewBox';
import isAuth from '@web/components/isAuth';
import { toaster } from '@web/components/ui/toaster';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useAuth } from '@web/hooks/useAuth';
import { queryClient } from '@web/pages/_app';
import { useRouter } from 'next/router';
import { useState } from 'react';

function Review() {
  const [createFormLoading, setCreateFormLoading] = useState(false);
  const {
    assignedGroupData,
    formInstanceName,
    formTemplate,
    formInstanceDescription,
    pdfFile,
  } = useCreateFormInstance();
  const router = useRouter();
  const createFormInstanceMutation = useMutation({
    ...formInstancesControllerCreateMutation(),
    onSuccess: () => {
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
    },
  });
  const { user } = useAuth();

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

    await createFormInstanceMutation
      .mutateAsync({
        body: {
          name: formInstanceName ?? formTemplate.name,
          assignedGroups: assignedGroupData.map((data, _) => {
            return {
              order: data.order,
              fieldGroupId: data.fieldGroupId,
              signerType: data.signerType,
              signerEmployeeList: data.signerEmployeeList,
              signerDepartmentId: data.signerDepartmentId,
              signerPositionId: data.signerPositionId,
              signerEmployeeId: data.signerEmployeeId,
            };
          }),
          originatorId: user.id,
          formTemplateId: formTemplate.id,
          formDocLink: formTemplate.formDocLink,
          description: formInstanceDescription ?? formTemplate.description!!,
        },
      })
      .then(async (response) => {
        router
          .push({
            pathname: '/form-instance/create/success',
            query: {
              id: response.id,
            },
          })
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
      type={FormInteractionType.CreateFormInstance}
      pageNumber={4}
      heading={'Create form instance'}
      subheading={'Review your form instance'}
      boxContent={
        <ReviewBox
        assignedGroupData={assignedGroupData}
          pdfFile={pdfFile}
          name={formInstanceName ?? ''}
          description={formInstanceDescription ?? ''}
          fieldGroups={formTemplate?.fieldGroups ?? []}
        />
      }
      submitFunction={_submitFormInstance}
      backLink={'/form-instance/create/assign-groups'}
      review={true}
      disabled={createFormLoading}
      loading={createFormLoading}
    />
  );
}

export default isAuth(Review);
