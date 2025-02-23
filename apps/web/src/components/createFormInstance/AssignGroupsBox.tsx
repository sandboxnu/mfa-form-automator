import { Text, Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { SignatureDropdown } from './SignatureDropdown';
import { FieldGroupBaseEntity } from '../../client/types.gen';
import { positionsControllerFindAllOptions } from '@web/client/@tanstack/react-query.gen';
import { FormView } from './FormView';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';

/**
 * The contents of the white box for assigning groups.
 *
 * @param formLink link to form preview
 * @param name form name
 * @param description form description
 * @param fieldGroups list of signature fields in the form template
 */
export const AssignGroupsBox = ({
  formLink,
  name,
  description,
  fieldGroups,
}: {
  formLink: string;
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
  console.log('Assigned Groups Data:', assignedGroupData);

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
          {fieldGroups.map((field, i) => (
            <SignatureDropdown
              key={field.id}
              field={field}
              index={i}
              positions={positions}
              assignedGroupData={assignedGroupData}
              setAssignedGroupData={setAssignedGroupData}
            />
          ))}
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
        <FormView formTemplateName={name} pdfUrl={formLink} />
      </Flex>
    </Flex>
  );
};
