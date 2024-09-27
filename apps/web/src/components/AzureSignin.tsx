import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@web/authConfig';
import { Button } from '@chakra-ui/react';
import { useAuth } from '@web/hooks/useAuth';

/**
 * @returns a button that allows users to sign in with Azure
 */
export const AzureSignin: React.FC = () => {
  const { instance, accounts } = useMsal();
  const { login } = useAuth();

  /**
   * Login to Azure through a popup and set the user's session
   */
  const handleLogin = async () => {
    try {
      const loginResponse = await instance.loginPopup(loginRequest);
      if (loginResponse) {
        login(loginResponse.account.username, 'password');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button background="#2596be" color="#FFF" onClick={handleLogin}>
      Sign in with Azure
    </Button>
  );
};
