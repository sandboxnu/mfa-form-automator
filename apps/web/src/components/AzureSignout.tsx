import React from 'react';
import { useMsal } from '@azure/msal-react';
import { useAuth } from '@web/hooks/useAuth.ts';
import { Button, Flex, Text } from '@chakra-ui/react';
import { SignoutIcon } from '@web/static/icons.tsx';
import { Toaster, toaster } from './ui/toaster';

/**
 * @returns a button that allows users to sign out of Azure
 */
export const AzureSignout: React.FC = () => {
  const { logout } = useAuth();
  const { instance, accounts } = useMsal();

  /**
   * Logout of Azure through a popup and clear the user's session
   */
  const handleLogout = () => {
    const logoutRequest = {
      account: accounts[0],
    };
    try {
      instance
        .logoutPopup(logoutRequest)
        .then(() => {
          logout();
        })
        .catch((error) => {
          toaster.create({
            title: 'Failed to log out',
            description: 'Please try again.',
            type: 'error',
            duration: 3000,
          });
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button background="white" onClick={handleLogout} cursor="pointer">
      <Toaster />
      <Flex alignItems="center" justifyContent="start">
        <Text
          color="#4C658A"
          fontSize="18px"
          fontWeight="500"
          pl="24px"
          pr="12px"
          py="10px"
        >
          Sign out with Azure
        </Text>
        <SignoutIcon boxSize="24px" />
      </Flex>
    </Button>
  );
};
