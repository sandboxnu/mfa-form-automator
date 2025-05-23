import { useMutation } from '@tanstack/react-query';
import {
  formInstancesControllerCreateMutation,
  formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey,
  formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey,
  formInstancesControllerFindAllInfiniteQueryKey,
  formInstancesControllerFindAllQueryKey,
} from '@web/client/@tanstack/react-query.gen';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/createFormInstance/ReviewBox';
import isAuth from '@web/components/isAuth';
import { toaster } from '@web/components/ui/toaster';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useRouterContext } from '@web/context/RouterProvider';
import { useAuth } from '@web/hooks/useAuth';
import { queryClient } from '@web/pages/_app';
import { AxiosError } from 'axios';
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
  const { isRouteChanging } = useRouterContext();
  const createFormInstanceMutation = useMutation({
    ...formInstancesControllerCreateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formInstancesControllerFindAllQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: formInstancesControllerFindAllInfiniteQueryKey(),
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
        setCreateFormLoading(false);
        if (e instanceof AxiosError) {
          toaster.create({
            title: 'Failed to create form instance',
            description: e.response?.data.message ?? e.message,
            type: 'error',
            duration: 3000,
          });
        } else {
          toaster.create({
            title: 'Failed to create form instance',
            description: (e as Error).message,
            type: 'error',
            duration: 3000,
          });
        }
      });
    // always set loading to false
    setCreateFormLoading(false);
  };

  if (!formTemplate) {
    return <></>;
  }

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
          fieldGroups={formTemplate.fieldGroups ?? []}
          formTemplate={formTemplate}
        />
      }
      submitFunction={_submitFormInstance}
      backLink={'/form-instance/create/assign-groups'}
      review={true}
      disabled={createFormLoading || isRouteChanging}
      loading={createFormLoading || isRouteChanging}
    />
  );
}

export default isAuth(Review);
