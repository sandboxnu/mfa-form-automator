import { useMutation } from '@tanstack/react-query';
import { CreateFieldGroupDto, CreateTemplateBoxDto, Scope } from '@web/client';
import {
  formTemplatesControllerFindAllQueryKey,
  formTemplatesControllerUpdateMutation,
} from '@web/client/@tanstack/react-query.gen';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/createFormTemplate/ReviewBox';
import isAuth from '@web/components/isAuth';
import { toaster } from '@web/components/ui/toaster';
import { useEditFormTemplate } from '@web/context/EditFormTemplateContext';
import { queryClient } from '@web/pages/_app';
import { useRouter } from 'next/router';
import { useState } from 'react';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
function Review() {
  const {
    formTemplateName,
    formTemplateDescription,
    pdfFile,
    fieldGroups: fieldGroupsContext,
    formFields: formFieldsContext,
    formTemplateUseId,
    formDimensions,
  } = useEditFormTemplate();
  const [createFormLoading, setCreateFormLoading] = useState(false);

  const router = useRouter();

  const updateFormTemplateMutation = useMutation({
    ...formTemplatesControllerUpdateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formTemplatesControllerFindAllQueryKey(),
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
    console.log(fieldGroupsContext);

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
    console.log(fieldGroupsContext);
    console.log(formFieldsContext);
    console.log(fieldGroups);
    if (formDimensions)
      await updateFormTemplateMutation
        .mutateAsync({
          body: {
            name: formTemplateName ?? '',
            description: formTemplateDescription ?? '',
            disabled: false,
            fieldGroups: fieldGroups,
          },
          path: {
            id: formTemplateUseId!!,
          },
        })
        .then(async (response) => {
          await queryClient.invalidateQueries({
            queryKey: formTemplatesControllerFindAllQueryKey(),
          });
          router
            .push('/form-template/' + formTemplateUseId + '/edit/success')
            .then(() => {
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

  function printDetails() {
    console.log(fieldGroupsContext);
    console.log(formFieldsContext);
  }

  return (
    <FormLayout
      type={FormInteractionType.EditFormTemplate}
      pageNumber={4}
      heading={'Edit form template'}
      subheading={'Review your form template'}
      boxContent={
        <ReviewBox
          pdfFile={pdfFile}
          name={formTemplateName ?? ''}
          description={formTemplateDescription ?? ''}
          fieldGroups={fieldGroupsContext}
          type={FormInteractionType.EditFormTemplate}
        />
      }
      submitFunction={_submitFormTemplate}
      backLink={'/form-template/' + formTemplateUseId + '/edit/input-fields'}
      disabled={createFormLoading}
      review={true}
    />
  );
}

export default isAuth(Review, [Scope.ADMIN, Scope.CONTRIBUTOR]);
