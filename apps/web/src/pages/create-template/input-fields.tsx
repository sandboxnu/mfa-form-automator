import { FormTemplateLayout } from '@web/components/createFormTemplate/FormTemplateLayout';
import { FormEditor } from '@web/components/createFormTemplate/createFormTemplateEditor/FormEditor';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { Box } from '@chakra-ui/react';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */

export default function InputFields() {
  const {
    useBlob,
    formTemplateName,
    formFields,
    setFormFields,
    fieldGroups,
    setFieldGroups,
  } = useCreateFormTemplate();

  const { localBlobData } = useBlob;

  return (
    <FormTemplateLayout
      pageNumber={3}
      subheading={
        'Select an assignee group and drag to add input fields for each'
      }
      boxContent={
        <Box width="1000px">
          <FormEditor
            formTemplateName={formTemplateName ?? ''}
            pdfUrl={localBlobData.url}
            disableEdit={false}
            formFields={formFields}
            setFormFields={setFormFields}
            fieldGroups={fieldGroups}
            setFieldGroups={setFieldGroups}
            scale={1}
          />
        </Box>
      }
      deleteFunction={() => {}}
      submitLink={'/create-template/review'}
      backLink={'/create-template/description'}
      // TODO set disabled based on some state in the pdf editor component
      disabled={false}
    />
  );
}
