import { Avatar, Box, Portal, Tooltip } from '@chakra-ui/react';
import { ProfileHover } from './ProfileHover.tsx';

/**
 * Wraps an Avatar with a profive signature hover that shows the name of the signer
 * (may be user name, position name, dept name etc) and whether they have signed.
 * Used in FormRow.
 * @param name the name of the user
 * @param signedAt date of signing, or null
 * @param index the index of the avatar in the list for a particular form
 * @returns an hoverable avatar component
 */
export const HoverableAvatar = ({
  name,
  signedAt,
}: {
  name: string;
  signedAt: string | null;
}) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Box>
          <Avatar.Root
            boxSize="32px"
            backgroundColor={signedAt ? '#D0F0DC' : '#DCDCDC'}
            border="1px solid #FFFFFF"
            color="black"
            fontWeight={400}
            fontSize="14px"
            size="sm"
            cursor="pointer"
          >
            <Avatar.Fallback name={name} />
          </Avatar.Root>
        </Box>
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content
            fontSize="16px"
            fontWeight="bold"
            p="5px"
            color="black"
            background="white"
            boxSize={'fit-content'}
          >
            <ProfileHover name={name} signedAt={signedAt} />
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
};
