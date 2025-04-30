import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormEditor } from '@web/components/createFormTemplate/createFormTemplateEditor/FormEditor';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { Box } from '@chakra-ui/react';
import isAuth from '@web/components/isAuth';
import { Scope } from '@web/client';
import { FormInteractionType } from '@web/components/createForm/types';
import Error from '@web/components/Error';

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
    formTemplateUseId,
  } = useCreateFormTemplate();

  if (!formDimensions || !formFields) {
    return <Error></Error>;
  }

  return (
    <FormLayout
      type={
        formTemplateUseId
          ? FormInteractionType.EditFormTemplate
          : FormInteractionType.CreateFormTemplate
      }
      pageNumber={3}
      heading={
        formTemplateUseId ? 'Edit form template' : 'Create form template'
      }
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
      submitLink={'/create-template/review'}
      backLink={'/create-template/description'}
      disabled={
        Object.values(formFields)
          .map((page) => Array.from(page.values()))
          .reduce((prev, curr) => prev + curr.length, 0) === 0
      }
    />
  );
}

export default isAuth(InputFields, [Scope.ADMIN, Scope.CONTRIBUTOR]);
