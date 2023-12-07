import {
  Box,
  Hide,
  IconButton,
  Text,
  Flex,
  Spacer,
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import {
  DropdownDownArrow,
  DropdownUpArrow,
  MFALogoIcon,
  UserProfileAvatar,
} from 'apps/web/src/static/icons';
import { useAuth } from '@web/hooks/useAuth';
import { useState } from 'react';

export const TopBar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isUserInfoOpen, setIsUserInfoOpen] = useState<boolean>(false);

  return (
    <Flex
      as="header"
      align="center"
      pos="fixed"
      w="full"
      px="4"
      bg="white"
      _dark={{
        bg: 'gray.800',
      }}
      borderBottomWidth="1px"
      color="inherit"
      h="96px"
      zIndex="sticky"
    >
      <Box minWidth={302}>
        <Flex px="4" py="5" align="left">
          <MFALogoIcon height="51px" width="220px" />
        </Flex>
      </Box>
      <Spacer />

      <Flex align="center" pl="10">
        <Hide breakpoint="(max-width: 1000px)">
          <Text minW="200" align="right">
            Welcome back, {user?.firstName}!
          </Text>
        </Hide>
        <Spacer w="12px" />
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <Box>
              <IconButton
                aria-label="Visit profile"
                icon={
                  user?.firstName && user?.lastName ? (
                    <UserProfileAvatar
                      firstName={user.firstName}
                      lastName={user.lastName}
                      boxSize={7}
                    />
                  ) : (
                    <UserProfileAvatar
                      firstName="Default"
                      lastName="User"
                      boxSize={7}
                    />
                  )
                }
                colorScheme="none"
              />
              <Hide breakpoint="(max-width: 1000px)">
                <Flex pr="24px">
                  <Text pr="10px" fontSize="18">
                    {user?.firstName + ' ' + user?.lastName}
                  </Text>
                  {isUserInfoOpen ? (
                    <DropdownUpArrow maxH="8px" alignSelf="center" />
                  ) : (
                    <DropdownDownArrow maxH="8px" alignSelf="center" />
                  )}
                </Flex>
              </Hide>
            </Box>
          </PopoverTrigger>
          <PopoverContent maxW="150px">
            <PopoverBody>
              <Box>
                <Text
                  fontSize="17px"
                  fontWeight="700"
                  cursor="default"
                  pb="10px"
                >
                  {user?.firstName + ' ' + user?.lastName}
                </Text>
                <Button
                  borderRadius="8px"
                  height="25px"
                  cursor="default"
                  onClick={logout}
                >
                  Logout
                </Button>
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Spacer w="40px" />
      </Flex>
    </Flex>
  );
};
