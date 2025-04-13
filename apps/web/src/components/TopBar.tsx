import { Box, IconButton, Text, Flex, Spacer, Button } from '@chakra-ui/react';
import {
  MFALogoIcon,
  SettingsIcon,
  UserProfileAvatar,
} from 'apps/web/src/static/icons.tsx';
import { useAuth } from '@web/hooks/useAuth.ts';
import { useQuery } from '@tanstack/react-query';
import { AzureSignout } from './AzureSignout.tsx';
import { SignOut } from './SignOut.tsx';
import { positionsControllerFindAllOptions } from '@web/client/@tanstack/react-query.gen.ts';
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from '../components/ui/popover';
import { Scope } from '@web/client/types.gen.ts';
import { useState } from 'react';
import { UserSettings } from './UserSettings.tsx';
import { useRouter } from 'next/router';

/**
 * @returns the top bar of the application
 */
export const TopBar: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { data: positions } = useQuery({
    ...positionsControllerFindAllOptions(),
  });

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const userPosition = positions?.find(
    (position) => position.id === user?.positionId,
  );

  return (
    <>
      <UserSettings
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
      />
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
          <Flex
            px="8"
            py="5"
            align="left"
            onClick={() => {
              router.push('/');
            }}
          >
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
          <PopoverRoot
            open={isPopoverOpen}
            onOpenChange={(e) => setIsPopoverOpen(e.open)}
            positioning={{ placement: 'bottom-end' }}
          >
            <PopoverTrigger asChild>
              <button>
                <Flex align="center">
                  <IconButton
                    aria-label="Visit profile"
                    colorScheme="none"
                    background="white"
                  >
                    {user?.firstName && user?.lastName ? (
                      <UserProfileAvatar
                        firstName={user.firstName}
                        lastName={user.lastName}
                      />
                    ) : (
                      <UserProfileAvatar firstName="Default" lastName="User" />
                    )}
                  </IconButton>
                </Flex>
              </button>
            </PopoverTrigger>
            <PopoverContent maxW="288px">
              <PopoverBody divideX="2px" borderRadius="6px" mb="14px">
                <Box pl="24px" pb="14px">
                  <Text fontSize="18px" cursor="default" pt="18px">
                    {user?.firstName && user?.lastName
                      ? user.firstName + ' ' + user.lastName
                      : 'Firstname Lastname'}
                  </Text>
                  <Text
                    color="#888888"
                    fontSize="18px"
                    cursor="default"
                    pt="8px"
                  >
                    {user?.scope === Scope.ADMIN
                      ? 'Administrator'
                      : user?.scope === Scope.CONTRIBUTOR
                      ? 'Contributor'
                      : 'Viewer'}
                  </Text>
                  <Text
                    color="#888888"
                    fontSize="18px"
                    cursor="default"
                    pt="8px"
                  >
                    {userPosition && userPosition.name
                      ? userPosition.name
                      : 'Position'}
                  </Text>
                </Box>

                <Box w="100%">
                  <Button
                    background="white"
                    onClick={() => {
                      setIsPopoverOpen(false);
                      setTimeout(() => {
                        setIsSettingsOpen(true);
                      }, 50);
                    }}
                    cursor="pointer"
                  >
                    <Text
                      color="#4C658A"
                      fontSize="18px"
                      fontWeight="500"
                      pl="24px"
                      pr="12px"
                      py="10px"
                    >
                      Settings
                    </Text>
                    <SettingsIcon boxSize="24px" color="#4C658A" />
                  </Button>
                  <AzureSignout />
                  <SignOut />
                </Box>
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>
        </Flex>
      </Flex>
    </>
  );
};
