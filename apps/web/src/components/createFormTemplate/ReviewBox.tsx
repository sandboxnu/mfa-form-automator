import { Box, Text, Flex } from '@chakra-ui/react';
import { FieldGroups, FormFields } from './createFormTemplateEditor/FormEditor';
import { group } from 'console';

/**
 * The contents of the white box for the page (step 2) that asks the user for the form's name and
 * optional description.  Includes the following components: name label, name input box, description label,
 * description input box, preview label, form preview.  Used in description.tsx page.
 * @param setName function to save the inputted name of the form
 * @param setDescription function to save the inputted description of the form
 * @param formLink link to form to preview
 */
export const ReviewBox = ({
  formLink,
  name,
  description,
  groups,
  fields,
}: {
  formLink: string;
  name: string;
  description: string;
  groups: FieldGroups;
  fields: FormFields;
}) => {
  const textInputStyle = {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    borderRadius: '4px',
    border: '1px solid #E5E5E5',
    outlineColor: 'transparent',
    borderColor: 'transparent',
  };
  // TODO: these groups should instead be taken from state

  const GroupItem = ({ num, groupId }: { num: number; groupId: string }) => {
    console.log(groups.get(groupId))
    return num <= groups.size ? (
      <Flex gap="10px">
        <Box
          width="24px"
          height="24px"
          backgroundColor={groups.get(groupId)?.backgroundColor}
          borderColor={groups.get(groupId)?.borderColor}
        ></Box>
        <Text>Group {num + 1}</Text>
      </Flex>
    ) : (
      <></>
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
          {Array.from(groups.entries()).map(([key, value], i) => (
            <GroupItem key={i} num={i} groupId={key} />
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
        <embed
          src={formLink}
          type="application/pdf"
          width="400px"
          height="500px"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'stretch',
            border: '1px solid #E5E5E5',
            borderRadius: '8px',
            width: '100%',
          }}
        />
      </Flex>
    </Flex>
  );
};
