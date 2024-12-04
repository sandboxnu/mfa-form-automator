import { Box, Text, Flex } from '@chakra-ui/react';

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
}: {
  formLink: string;
  name: string;
  description: string;
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
  const groups: string[] = ['Group 1', 'Group 2', 'Group 3'];

  const GroupItem = ({ num }: { num: number }) => {
    return num <= groups.length ? (
      <Flex gap="10px">
        <Box
          width="24px"
          height="24px"
          {...(num === 1
            ? {
                border: '1px solid var(--Blue, #1367EA)',
                background: '#EEF5FF',
              }
            : num === 2
            ? {
                border: '1px solid #BD21CA',
                background: '#FDEAFF',
              }
            : num === 3
            ? {
                border: '1px solid #7645E8',
                background: '#ECE4FF',
              }
            : {})}
        ></Box>
        <Text>{groups[num - 1]}</Text>
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
          <GroupItem num={1} />
          <GroupItem num={2} />
          <GroupItem num={3} />
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
