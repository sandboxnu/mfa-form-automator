import { useMutation } from '@tanstack/react-query';
import { CreateFieldGroupDto, CreateTemplateBoxDto, Scope } from '@web/client';
import {
  formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey,
  formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey,
  formTemplatesControllerCreateMutation,
  formTemplatesControllerFindAllQueryKey,
} from '@web/client/@tanstack/react-query.gen';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/createFormTemplate/ReviewBox';
import isAuth from '@web/components/isAuth';
import { toaster } from '@web/components/ui/toaster';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { queryClient } from '@web/pages/_app';
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
        queryKey:
          formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey:
          formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey(),
      });
    },
  });
  const _submitFormTemplate = async () => {
    if (createFormLoading) {
      return;
    }
    if (!pdfFile) {
      throw new Error('No PDF file uploaded');
    }

    setCreateFormLoading(true);

    console.log('submitting template');
    let fieldGroups: CreateFieldGroupDto[] = [];
    let orderVal = 0;
    console.log(formFieldsContext);

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
            pageHeight: formDimensions.height,
            pageWidth: formDimensions.width,
            name: formTemplateName ?? '',
            fieldGroups: fieldGroups,
            file: pdfFile,
            description: formTemplateDescription ?? '',
            disabled: false,
          },
        })
        .then(async (response) => {
          await queryClient.invalidateQueries({
            queryKey: formTemplatesControllerFindAllQueryKey(),
          });
          router.push('/form-template/create/success').then(() => {
            setCreateFormLoading(false);
          });
          return response;
        })
        .catch((e) => {
          toaster.create({
            title: 'Failed to create form template',
            description: (e as Error).message,
            type: 'error',
            duration: 3000,
          });
          throw e;
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
