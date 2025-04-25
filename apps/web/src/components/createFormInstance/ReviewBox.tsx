import { Box, Text, Flex } from '@chakra-ui/react';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { FormEditor } from '../createFormTemplate/createFormTemplateEditor/FormEditor';
import { FieldGroupBaseEntity } from '@web/client';
import {
  formEditorTranslateFieldGroups,
  formEditorTranslateFormFields,
} from '@web/utils/formInstanceUtils';
import { groupColors } from '@web/utils/formTemplateUtils';
import { FormInteractionType } from '../createForm/types';
import { useEditFormInstance } from '@web/context/EditFormInstanceContext';

export const ReviewBox = ({
  type,
  pdfFile,
  name,
  description,
  fieldGroups,
}: {
  type:
    | FormInteractionType.CreateFormInstance
    | FormInteractionType.EditFormInstance;
  pdfFile: File | null;
  name: string;
  description: string;
  fieldGroups: FieldGroupBaseEntity[];
}) => {
  const textInputStyle = {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    borderRadius: '4px',
    border: '1px solid #E5E5E5',
    outlineColor: 'transparent',
    borderColor: 'transparent',
  };

  const { assignedGroupData } =
    type == FormInteractionType.CreateFormInstance
      ? useCreateFormInstance()
      : useEditFormInstance();

  const GroupItem = ({ color, border }: { color: string; border: string }) => {
    return (
      <Flex gap="10px" alignItems="center">
        <Box
          width="24px"
          height="24px"
          backgroundColor={color}
          border={`1px solid ${border}`}
        />
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
            <Text fontWeight={600}>Assigned Field Groups</Text>
          </Flex>
          {assignedGroupData.map((group, i) => {
            const [border, background] = groupColors[i % groupColors.length];
            return (
              <Flex key={i} align="center" mr={4}>
                <GroupItem color={background} border={border} />
                <Text ml={2}>{group ? group.name : 'No Group'}</Text>
              </Flex>
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
            formTemplateName={name ?? ''}
            pdfFile={pdfFile}
            disableEdit
            fieldGroups={formEditorTranslateFieldGroups(fieldGroups)}
            formFields={formEditorTranslateFormFields(fieldGroups)}
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
