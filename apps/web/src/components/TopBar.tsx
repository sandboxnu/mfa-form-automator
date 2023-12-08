import {
  Box,
  Hide,
  IconButton,
  Text,
  Flex,
  Spacer,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Divider,
} from '@chakra-ui/react';
import {
  DropdownDownArrow,
  DropdownUpArrow,
  MFALogoIcon,
  SignoutIcon,
  UserProfileAvatar,
} from 'apps/web/src/static/icons';
import { useAuth } from '@web/hooks/useAuth';

export const TopBar: React.FC = () => {
  const { user, logout } = useAuth();

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

      <Flex align="center" pl="10" mr="24px">
        <Popover placement="bottom-end" closeOnBlur={true}>
          {({ isOpen, onClose }) => (
            <>
              <PopoverTrigger>
                <button>
                  <Flex align="center">
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
                      <Flex>
                        <Text px="10px" fontSize="18">
                          {user?.firstName + ' ' + user?.lastName}
                        </Text>
                        {isOpen ? (
                          <DropdownUpArrow maxH="8px" alignSelf="center" />
                        ) : (
                          <DropdownDownArrow maxH="8px" alignSelf="center" />
                        )}
                      </Flex>
                    </Hide>
                  </Flex>
                </button>
              </PopoverTrigger>
              <PopoverContent maxW="288px">
                <PopoverBody borderRadius="6px" p="0">
                  <Box pl="24px" pb="14px">
                    <Text fontSize="18px" cursor="default" pt="18px">
                      {user?.firstName + ' ' + user?.lastName}
                    </Text>
                    <Text color="#888888" fontSize="18px" cursor="default">
                      Position
                    </Text>
                  </Box>
                  <Divider />
                  <button onClick={logout}>
                    <Flex align="center">
                      <Text
                        color="#4C658A"
                        fontSize="18px"
                        fontWeight="500"
                        pl="24px"
                        pr="12px"
                        py="14px"
                      >
                        Sign out
                      </Text>
                      <SignoutIcon />
                    </Flex>
                  </button>
                </PopoverBody>
              </PopoverContent>
            </>
          )}
        </Popover>
      </Flex>
    </Flex>
  );
};
