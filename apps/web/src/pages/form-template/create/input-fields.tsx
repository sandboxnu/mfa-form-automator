import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormEditor } from '@web/components/createFormTemplate/createFormTemplateEditor/FormEditor';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { Box } from '@chakra-ui/react';
import isAuth from '@web/components/isAuth';
import { Scope } from '@web/client';
import { FormInteractionType } from '@web/components/createForm/types';
import { useRouter } from 'next/router';
import { useRouterContext } from '@web/context/RouterProvider';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */

function InputFields() {
  const {
    formTemplateName,
    formFields,
    setFormFields,
    fieldGroups,
    setFieldGroups,
    pdfFile,
    formDimensions,
  } = useCreateFormTemplate();

  const router = useRouter();
  const { isRouteChanging } = useRouterContext();

  if (!formDimensions || !formFields) {
    return <></>;
  }

  return (
    <FormLayout
      type={FormInteractionType.CreateFormTemplate}
      pageNumber={3}
      heading={'Create form template'}
      subheading={
        'Select an assignee group and drag to add input fields for each'
      }
      boxContent={
        <Box width="100%">
          <FormEditor
            formTemplateName={formTemplateName ?? ''}
            formTemplateDimensions={formDimensions}
            pdfFile={pdfFile}
            disableEdit={false}
            formFields={formFields}
            setFormFields={setFormFields}
            fieldGroups={fieldGroups}
            setFieldGroups={setFieldGroups}
          />
        </Box>
      }
      submitFunction={() => {
        router.push('/form-template/create/review');
      }}
      backLink={'/form-template/create/description'}
      disabled={
        Object.values(formFields)
          .map((page) => Array.from(page.values()))
          .reduce((prev, curr) => prev + curr.length, 0) === 0 ||
        isRouteChanging
      }
      loading={isRouteChanging}
    />
  );
}

export default isAuth(InputFields, [Scope.ADMIN, Scope.CONTRIBUTOR]);
