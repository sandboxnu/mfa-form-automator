import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import { ProfileHover } from './ProfileHover.tsx';
import { Avatar } from './ui/avatar.tsx';

/**
 * Wraps an Avatar with a profive signature hover that shows the name of the signer
 * (may be user name, position name, dept name etc) and whether they have signed.
 * Used in FormRow.
 * @param name the name of the user
 * @param signed true if they have signed the form this hover is attached to
 * @param index the index of the avatar in the list for a particular form
 * @returns an hoverable avatar component
 */
export const HoverableAvatar = ({
  name,
  signed,
  index,
}: {
  name: string;
  signed: boolean;
  index: any;
}) => {
  // return (
  //   <Popover.Root trigger="hover" openDelay={800} closeDelay={0}>
  //     <PopoverTrigger>
  //       <Avatar
  //         name={name}
  //         key={index}
  //         boxSize="36px"
  //         backgroundColor={signed ? '#D0F0DC' : '#DCDCDC'}
  //         border="1px solid #FFFFFF"
  //         color="black"
  //         fontWeight={400}
  //         fontSize="14px"
  //         size="sm"
  //         cursor="pointer"
  //       />
  //     </PopoverTrigger>
  //     <PopoverContent boxSize={'fit-content'}>
  //       <PopoverArrow />
  //       <ProfileHover name={name} signed={signed} />
  //     </PopoverContent>
  //   </Popover.Root>
  // );
};
