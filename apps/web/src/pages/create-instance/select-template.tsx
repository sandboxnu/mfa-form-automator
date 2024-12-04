import { CreateFormLayout } from '@web/components/createFormLayout/CreateFormLayout';
import { TemplateSelectGrid } from '@web/components/createFormInstance/TemplateSelectGrid';
import React from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';

/**
 * The select template page in the form creation flow, where users select a template.
 */
export default function SelectTemplate() {
  return (
    <CreateFormLayout
      pageNumber={1}
      subheading={'Select a form template'}
      deleteFunction={() => {}}
      submitLink={'/create-template/description'}
      backLink={'/'}
      disabled={false}
    >
      <>
        <TemplateSelectGrid />
      </>
    </CreateFormLayout>
  );
}
