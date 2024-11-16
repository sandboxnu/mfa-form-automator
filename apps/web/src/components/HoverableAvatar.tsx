import {
    Avatar,
    Popover,
    PopoverArrow,
    PopoverContent,
    PopoverTrigger,
  } from '@chakra-ui/react';
import { ProfileHover } from './ProfileHover';
import {PositionEntity } from '@web/client';

export const HoverableAvatar = ({
    name,
    position,
    signed,
    backgroundColor,
    index,
}:{
    name:string
    position:PositionEntity
    signed?:boolean
    backgroundColor:any
    index:any
}) => {

    return <Popover trigger="hover">
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
                  />
              </PopoverTrigger>
              <PopoverContent boxSize={"fit-content"}>
                <PopoverArrow />
                <ProfileHover
                        name={name}
                        position={position.name}
                        signed={signed}/>
              </PopoverContent>
            </Popover>
}