import { Box, Text, Flex } from '@chakra-ui/react';
import {
  formEditorTranslateFieldGroups,
  formEditorTranslateFormFields,
} from '@web/utils/formInstanceUtils';
import { FormEditor } from '../createFormTemplate/createFormTemplateEditor/FormEditor';
import { FieldGroupBaseEntity } from '@web/client';

export const ReviewBox = ({
  pdfFile,
  name,
  description,
  fieldGroups,
  dimensions,
}: {
  pdfFile: File | null;
  name: string;
  description: string;
  fieldGroups: FieldGroupBaseEntity[];
  dimensions: { width: number; height: number };
}) => {
  const textInputStyle = {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    borderRadius: '4px',
    border: '1px solid #E5E5E5',
    outlineColor: 'transparent',
    borderColor: 'transparent',
  };

  return (
    <Flex
      flexDirection={'row'}
      gap={'40px'}
      alignContent={'justify'}
      alignSelf="stretch"
      width="100%"
    >
      <Flex
        flexDirection="column"
        gap="24px"
        width="480px"
        alignItems={'flex-start'}
      >
        <Flex gap="8px" flexDirection="column" width="480px">
          <Text fontWeight={600}>Name</Text>
          <Text {...textInputStyle}>{name}</Text>
        </Flex>
        <Flex gap="8px" flexDirection="column" width="480px">
          <Text fontWeight={600}>Description</Text>
          <Text {...textInputStyle}>{description}</Text>
        </Flex>
      </Flex>
      <Flex
        flexDirection={'column'}
        gap="8px"
        alignItems="flex-start"
        flex="1 0 0"
      >
        <Text
          color="#7C7F86"
          fontSize="14px"
          fontWeight="500px"
          lineHeight="21px"
        >
          Preview Only
        </Text>
        <Box minW="550px">
          <FormEditor
            formTemplateName={name ?? ''}
            formTemplateDimensions={dimensions}
            pdfFile={pdfFile}
            disableEdit
            fieldGroups={formEditorTranslateFieldGroups(fieldGroups)}
            formFields={formEditorTranslateFormFields(fieldGroups)}
            setFormFields={() => {}}
            setFieldGroups={() => {}}
            showNav={false}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
