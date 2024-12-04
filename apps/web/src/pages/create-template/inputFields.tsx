import { FormTemplateLayout } from '@web/components/createFormTemplate/FormTemplateLayout';
import { Flex } from '@chakra-ui/react';
import { FormEditor } from '@web/components/createFormTemplate/createFormTemplateEditor/FormEditor';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */

export default function InputFields() {
  const { useBlob, formTemplateName } = useCreateFormTemplate();

  const { localBlobData } = useBlob;

  return (
    <FormTemplateLayout
      pageNumber={3}
      subheading={
        'Select an assignee group and drag to add input fields for each'
      }
      boxContent={
        <FormEditor
          formTemplateName={formTemplateName ?? ''}
          pdfUrl={localBlobData.url}
        />
      }
      deleteFunction={() => {}}
      submitLink={'/create-template/review'}
      backLink={'/create-template/description'}
      // TODO set disabled based on some state in the pdf editor component
      disabled={false}
    />
  );
}
