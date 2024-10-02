import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@web/authConfig';
import { Button } from '@chakra-ui/react';
import { useAuth } from '@web/hooks/useAuth';

/**
 * @returns a button that allows users to sign in with Azure
 */
export const AzureSignin: React.FC = () => {
  const { instance } = useMsal();
  const { login } = useAuth();

  /**
   * Login to Azure through a popup and set the user's session
   */
  const handleLogin = () => {
    try {
      instance
        .loginPopup(loginRequest)
        .then((response) => {
          login(response.account.username, 'password');
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button color="#FFF" background="#2596be" onClick={handleLogin}>
      Sign in with Azure
    </Button>
  );
};
