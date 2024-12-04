import { Flex } from '@chakra-ui/react';
import { CreateFormLayout } from '@web/components/createFormLayout/CreateFormLayout';
import { FormEditor } from '@web/components/createFormTemplate/createFormTemplateEditor/FormEditor';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */

export default function InputFields() {
  const { useBlob, formTemplateName } = useCreateFormTemplate();

  const { localBlobData } = useBlob;

  return (
    <CreateFormLayout
      pageNumber={3}
      subheading={
        'Select an assignee group and drag to add input fields for each'
      }
      deleteFunction={() => {}}
      submitLink={'/create-template/review'}
      backLink={'/create-template/description'}
      // TODO set disabled based on some state in the pdf editor component
      disabled={false}
    >
      <FormEditor
        formTemplateName={formTemplateName ?? ''}
        pdfUrl={localBlobData.url}
        disableEdit={false}
      />
    </CreateFormLayout>
  );
}
