import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router.js';
import { AssignedAvatarGroup } from './AssignedAvatarGroup';
import { AssignedGroupEntity } from '@web/client';

/**
 * @param formName - the name of the form
 * @param assignedGroups - the assigned groups on the form
 * @param link - the link to the form
 * @returns a card for a form
 */
export const FormCard = ({
  formName,
  assignedGroups,
  link,
}: {
  formName: String;
  assignedGroups: AssignedGroupEntity[];
  link: string;
}) => {
  const router = useRouter();

  return (
    <>
      <Box
        minW="246px"
        minH="120px"
        borderRadius="5px"
        backgroundColor="#FFFFFF"
        boxShadow="0px 0.5px 3px 1px #DCDCDC"
        background="#FCFCFC"
        cursor="pointer"
        onClick={() => {
          router.push(link);
        }}
        _hover={{
          boxShadow: '0px 0.5px 6px 1px #DCDCDC',
        }}
      >
        <Box padding="24px" paddingBottom="27px" paddingTop="27px">
          <Text
            fontFamily="Hanken Grotesk"
            fontWeight={800}
            fontSize="18px"
            truncate
          >
            {formName}
          </Text>

          <AssignedAvatarGroup assignedGroups={assignedGroups} />
        </Box>
      </Box>
    </>
  );
};
