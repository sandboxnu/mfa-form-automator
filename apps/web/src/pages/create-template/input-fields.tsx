import { Flex } from '@chakra-ui/react';
import { CreateFormLayout } from '@web/components/createFormLayout/CreateFormLayout';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
export default function InputFields() {
  return (
    <CreateFormLayout
      pageNumber={3}
      subheading={
        'Select an assignee group and drag to add input fields for each'
      }
      deleteFunction={() => {}}
      submitLink={'/'}
      backLink={'/create-template/description'}
      // TODO set disabled based on some state in the pdf editor component
      disabled={false}
    >
      {/* TODO add pdf editor component here */}
      <Flex></Flex>
    </CreateFormLayout>
  );
}
