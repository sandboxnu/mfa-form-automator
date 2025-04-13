import { Text, Flex, Box } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { FieldGroupBaseEntity } from '../../client/types.gen';
import {
  departmentsControllerFindAllOptions,
  employeesControllerFindAllOptions,
  positionsControllerFindAllOptions,
} from '@web/client/@tanstack/react-query.gen';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { SignatureDropdown } from './SignatureDropdown';
import { FormEditor } from '../createFormTemplate/createFormTemplateEditor/FormEditor';
import {
  formEditorTranslateFieldGroups,
  formEditorTranslateFormFields,
} from '@web/utils/formInstanceUtils';
import { groupColors } from '@web/utils/formTemplateUtils';

/**
 * The contents of the white box for assigning groups.
 *
 * @param formLink link to form preview
 * @param name form name
 * @param description form description
 * @param fieldGroups list of signature fields in the form template
 */
export const AssignGroupsBox = ({
  pdfFile,
  name,
  description,
  fieldGroups,
}: {
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

  const { assignedGroupData, setAssignedGroupData } = useCreateFormInstance();
  const { data: positions } = useQuery(positionsControllerFindAllOptions());
  const { data: employees } = useQuery(employeesControllerFindAllOptions());
  const { data: departments } = useQuery(
    departmentsControllerFindAllOptions({
      query: {
        limit: 1000,
      },
    }),
  );

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
            <Text fontWeight={600}>Assign Field Groups</Text>
          </Flex>
          {fieldGroups.map((field, i) => {
            const [border, background] = groupColors[i % groupColors.length];
            return (
              <SignatureDropdown
                key={i}
                field={field}
                border={border}
                background={background}
                positions={positions}
                employees={employees}
                departments={departments}
                assignedGroupData={assignedGroupData}
                setAssignedGroupData={setAssignedGroupData}
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
        <Box width="580px">
          <FormEditor
            formTemplateName={name ?? ''}
            pdfFile={pdfFile}
            disableEdit
            fieldGroups={formEditorTranslateFieldGroups(fieldGroups)}
            formFields={formEditorTranslateFormFields(fieldGroups)}
            setFormFields={() => {}}
            setFieldGroups={() => {}}
            scale={0.6875}
            documentWidth={550}
            showNav={false}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
