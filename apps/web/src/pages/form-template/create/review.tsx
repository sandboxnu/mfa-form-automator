import { useMutation } from '@tanstack/react-query';
import { CreateFieldGroupDto, CreateTemplateBoxDto, Scope } from '@web/client';
import {
  formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey,
  formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey,
  formTemplatesControllerCreateMutation,
  formTemplatesControllerFindAllInfiniteQueryKey,
  formTemplatesControllerFindAllQueryKey,
} from '@web/client/@tanstack/react-query.gen';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/createFormTemplate/ReviewBox';
import isAuth from '@web/components/isAuth';
import { toaster } from '@web/components/ui/toaster';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { queryClient } from '@web/pages/_app';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
function Review() {
  const [createFormLoading, setCreateFormLoading] = useState(false);

  const {
    formTemplateName,
    formTemplateDescription,
    pdfFile,
    fieldGroups: fieldGroupsContext,
    formFields: formFieldsContext,
    formDimensions,
  } = useCreateFormTemplate();

  const router = useRouter();

  const createFormTemplateMutation = useMutation({
    ...formTemplatesControllerCreateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formTemplatesControllerFindAllQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: formTemplatesControllerFindAllInfiniteQueryKey(),
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

  /**
   * Upload and create a form template
   */
  const _submitFormTemplate = async () => {
    if (createFormLoading) {
      return;
    }
    if (!pdfFile) {
      throw new Error('No PDF file uploaded');
    }

    setCreateFormLoading(true);

    let fieldGroups: CreateFieldGroupDto[] = [];
    let orderVal = 0;

    // populate fieldGroups with fieldGroupsContext
    fieldGroupsContext.forEach((value, groupId) => {
      let templateBoxes: CreateTemplateBoxDto[] = [];

      // populate templateBoxes with formFieldsContext
      for (const page in formFieldsContext) {
        const fieldGroupsOnPage = formFieldsContext[page];
        fieldGroupsOnPage.forEach((field, _) => {
          if (field.groupId !== groupId) {
            return;
          }

          templateBoxes.push({
            type: field.type,
            x_coordinate: field.position.x,
            y_coordinate: field.position.y,
            width: field.position.width,
            height: field.position.height,
            page: parseInt(page),
          });
        });
      }
      fieldGroups.push({
        name: value.groupName,
        order: orderVal,
        templateBoxes: templateBoxes,
      });

      orderVal += 1;
    });
    if (formDimensions)
      await createFormTemplateMutation
        .mutateAsync({
          body: {
            pageHeight: Math.floor(formDimensions.height),
            pageWidth: Math.floor(formDimensions.width),
            name: formTemplateName ?? '',
            fieldGroups: fieldGroups,
            file: pdfFile,
            description: formTemplateDescription ?? '',
            disabled: false,
          },
        })
        .then(async (response) => {
          router.push('/form-template/create/success').then(() => {
            setCreateFormLoading(false);
          });
          return response;
        })
        .catch((e) => {
          setCreateFormLoading(false);
          if (e instanceof AxiosError) {
            toaster.create({
              title: 'Failed to create form template',
              description: e.response?.data.message ?? e.message,
              type: 'error',
              duration: 3000,
            });
          } else {
            toaster.create({
              title: 'Failed to create form template',
              description: (e as Error).message,
              type: 'error',
              duration: 3000,
            });

            setCreateFormLoading(false);
          }
        });
  };

  return (
    <FormLayout
      type={FormInteractionType.CreateFormTemplate}
      pageNumber={4}
      heading={'Create form template'}
      subheading={'Review your form template'}
      boxContent={
        <ReviewBox
          pdfFile={pdfFile}
          name={formTemplateName ?? ''}
          description={formTemplateDescription ?? ''}
          fieldGroups={fieldGroupsContext}
          formFields={formFieldsContext}
          formDimensions={formDimensions}
        />
      }
      submitFunction={_submitFormTemplate}
      backLink={'/form-template/create/input-fields'}
      disabled={createFormLoading}
      loading={createFormLoading}
      review={true}
    />
  );
}

export default isAuth(Review, [Scope.ADMIN, Scope.CONTRIBUTOR]);
