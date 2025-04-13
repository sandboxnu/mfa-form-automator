import { Box, Text, Flex } from '@chakra-ui/react';
import { FormEditor } from './createFormTemplateEditor/FormEditor';
import { FieldGroups } from './types';
import { useCreateFormTemplate } from '../../context/CreateFormTemplateContext';

/**
 * The contents of the white box for the page (step 2) that asks the user for the form's name and
 * optional description.  Includes the following components: name label, name input box, description label,
 * description input box, preview label, form preview.  Used in description.tsx page.
 * @param setName function to save the inputted name of the form
 * @param setDescription function to save the inputted description of the form
 * @param formLink link to form to preview
 */
export const ReviewBox = ({
  pdfFile,
  name,
  description,
  fieldGroups,
}: {
  pdfFile: File | null;
  name: string;
  description: string;
  fieldGroups: FieldGroups;
}) => {
  const textInputStyle = {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    borderRadius: '4px',
    border: '1px solid #E5E5E5',
    outlineColor: 'transparent',
    borderColor: 'transparent',
  };

  const { formFields } = useCreateFormTemplate();

  const GroupItem = ({
    num,
    color,
    border,
  }: {
    num: number;
    color: string;
    border: string;
  }) => {
    return (
      <Flex gap="10px" alignItems="center">
        <Box
          width="24px"
          height="24px"
          backgroundColor={color}
          border={`1px solid ${border}`}
        />
        <Text>Group {num}</Text>
      </Flex>
    );
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

        <Flex flexDirection={'column'} gap="12px">
          <Flex gap="12px" flexDirection="column" width="480px">
            <Text fontWeight={600}>Input Field Groups</Text>
          </Flex>
          {Object.keys(Object.fromEntries(fieldGroups)).map((key, index) => {
            const { border, background } = fieldGroups.get(key) as {
              border: string;
              background: string;
            };
            return (
              <GroupItem
                key={index}
                num={index + 1}
                color={background}
                border={border}
              />
            );
          })}
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
        <Box width="500px">
          <FormEditor
            formTemplateName={name}
            pdfFile={pdfFile}
            disableEdit
            fieldGroups={fieldGroups}
            formFields={formFields}
            setFormFields={() => {}}
            setFieldGroups={() => {}}
            scale={0.625}
            documentWidth={500}
            showNav={false}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
