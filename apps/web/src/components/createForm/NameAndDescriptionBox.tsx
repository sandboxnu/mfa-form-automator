import { Text, Flex, Box } from '@chakra-ui/react';
import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { FormEditor } from '../createFormTemplate/createFormTemplateEditor/FormEditor';
import { FieldGroupBaseEntity } from '@web/client';
import {
  formEditorTranslateFieldGroups,
  formEditorTranslateFormFields,
} from '@web/utils/formInstanceUtils';

/**
 * The contents of the white box for the page (step 2) that asks the user for the form's name and
 * optional description.  Includes the following components: name label, name input box, description label,
 * description input box, preview label, form preview.  Used in description.tsx page.
 * @param setName function to save the inputted name of the form
 * @param setDescription function to save the inputted description of the form
 * @param formLink link to form to preview
 */
export const NameAndDescriptionBox = ({
  pdfFile,
  fieldGroups,
  name,
  setName,
  description,
  setDescription,
  formDimensions,
}: {
  pdfFile: File | null;
  fieldGroups: FieldGroupBaseEntity[];
  name: string | null;
  setName: Dispatch<SetStateAction<string | null>>;
  description: string | null;
  setDescription: Dispatch<SetStateAction<string | null>>;
  formDimensions: { width: number; height: number };
}) => {
  const textInputStyle = {
    padding: '8px 10px',
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    borderRadius: '4px',
    border: '1px solid #E5E5E5',
    background: '#F5F7FA',
    outlineColor: 'transparent',
    borderColor: 'transparent',
  };

  return (
    <Flex
      flexDirection={'row'}
      gap={'40px'}
      width="100%"
      justifyContent={'space-between'}
    >
      <Flex
        flexDirection="column"
        gap="24px"
        alignItems={'flex-start'}
        flex={1}
        maxW="500px"
      >
        <Flex gap="10px" flexDirection="column" width="100%">
          <Text>
            Name{' '}
            <Text as="span" color="#FF4D4F">
              *
            </Text>
          </Text>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            style={{ ...textInputStyle }}
            placeholder="Form Name"
            value={name ?? ''}
          />
        </Flex>
        <Flex gap="10px" flexDirection="column" width="100%">
          <Text>Description (optional)</Text>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            style={{
              ...textInputStyle,
              height: '120px',
              resize: 'none',
            }}
            placeholder="For HR processing lorem ipsum dolor sit"
            value={description ?? ''}
          />
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
        <Box minW="500px">
          <FormEditor
            formTemplateName={name ?? ''}
            formTemplateDimensions={formDimensions}
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
