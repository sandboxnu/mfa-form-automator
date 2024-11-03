import {
  Box,
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
import { MFALogoIcon, UserProfileAvatar } from 'apps/web/src/static/icons';
import { useAuth } from '@web/hooks/useAuth';
import { PositionsService } from '@web/client';
import { useQuery } from '@tanstack/react-query';
import { AzureSignout } from './AzureSignout';
import { SignOut } from './SignOut';

/**
 * @returns the top bar of the application
 */
export const TopBar: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: positions } = useQuery({
    queryKey: ['api', 'positions'],
    queryFn: () => PositionsService.positionsControllerFindAll(),
  });

  const userPosition = positions?.find(
    (position) => position.id === user?.positionId,
  );

  return (
    <Flex
      as="header"
      align="center"
      pos="fixed"
      w="full"
      px="4"
      bg="#FEFEFE"
      _dark={{
        bg: 'gray.800',
      }}
      borderBottomWidth="1px"
      color="inherit"
      h="64px"
      zIndex="sticky"
    >
      <Box minWidth={302}>
        <Flex px="8" py="5" align="left">
          {/* Triangle */}
          <Box
            width="0"
            height="0"
            borderLeft="10px solid transparent"
            borderRight="10px solid transparent"
            borderBottom="20px solid #ED2324"
            transform="rotate(90deg)"
            alignSelf="center"
          />
          <MFALogoIcon height="24px" width="140px" ml="-3" />
        </Flex>
      </Box>
      <Spacer />

      <Flex align="center" pl="10" mr="32px">
        <Popover placement="bottom-end" closeOnBlur={true}>
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
                      />
                    ) : (
                      <UserProfileAvatar firstName="Default" lastName="User" />
                    )
                  }
                  colorScheme="none"
                />
              </Flex>
            </button>
          </PopoverTrigger>
          <PopoverContent maxW="288px">
            <PopoverBody borderRadius="6px" p="0">
              <Box pl="24px" pb="14px">
                <Text fontSize="18px" cursor="default" pt="18px">
                  {user?.firstName && user?.lastName
                    ? user.firstName + ' ' + user.lastName
                    : 'Firstname Lastname'}
                </Text>
                <Text color="#888888" fontSize="18px" cursor="default">
                  {userPosition && userPosition.name
                    ? userPosition.name
                    : 'Position'}
                </Text>
              </Box>
              <Divider />
              <AzureSignout />
              <SignOut />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </Flex>
  );
};
