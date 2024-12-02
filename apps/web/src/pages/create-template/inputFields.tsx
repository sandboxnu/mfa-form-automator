import { FormTemplateLayout } from '@web/components/createFormTemplate/FormTemplateLayout';
import { Flex } from '@chakra-ui/react';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
export default function InputFields() {
  return (
    <FormTemplateLayout
      pageNumber={3}
      subheading={
        'Select an assignee group and drag to add input fields for each'
      }
      // TODO replace box content with the pdf editor component
      boxContent={<Flex></Flex>}
      deleteFunction={() => {}}
      submitLink={'/'}
      backLink={'/create-template/description'}
      // TODO set disabled based on some state in the pdf editor component
      disabled={false}
    />
  );
}
