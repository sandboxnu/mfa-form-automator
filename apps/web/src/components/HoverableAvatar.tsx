import {
  Avatar,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import { ProfileHover } from './ProfileHover';
import { useState } from 'react';

export const HoverableAvatar = ({
  name,
  signed,
  backgroundColor,
  index,
}: {
  name: string;
  signed: boolean;
  backgroundColor: any;
  index: any;
}) => {
  return (
    <Popover trigger="hover" openDelay={800} closeOnBlur={true} placement="bottom">
      <PopoverTrigger>
        <Avatar
          name={name}
          key={index}
          boxSize="36px"
          backgroundColor={backgroundColor}
          border="1px solid #FFFFFF"
          color="black"
          fontWeight={400}
          fontSize="14px"
          size="sm"
          zIndex={10}
        />
      </PopoverTrigger>
      <PopoverContent boxSize={'fit-content'} position={"relative"}>
        <PopoverArrow />
        <ProfileHover name={name} signed={signed} />
      </PopoverContent>
    </Popover>
  );
};
