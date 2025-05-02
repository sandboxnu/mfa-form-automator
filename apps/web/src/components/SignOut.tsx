import React from 'react';
import { SignoutIcon } from '@web/static/icons.tsx';
import { Button, Text } from '@chakra-ui/react';
import { useAuth } from '@web/hooks/useAuth.ts';
import { useMsal } from '@azure/msal-react';
import { Toaster, toaster } from './ui/toaster';

export const SignOut: React.FC = () => {
  const { logout } = useAuth();
  const { instance, accounts } = useMsal();

  const handleAzureLogout = () => {
    if (!accounts || accounts.length === 0) {
      return;
    }
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
    <Button
      background="white"
      onClick={() => {
        logout();
        // handleAzureLogout(); // disabled so we don't logout people from Azure AD
      }}
      cursor="pointer"
    >
      <Toaster />
      <Text
        color="#4C658A"
        fontSize="18px"
        fontWeight="500"
        pl="24px"
        pr="12px"
        py="10px"
      >
        Sign out
      </Text>
      <SignoutIcon boxSize="24px" />
    </Button>
  );
};
