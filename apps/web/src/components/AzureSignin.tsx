import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@web/authConfig';
import { Button } from '@chakra-ui/react';
import { useAuth } from '@web/hooks/useAuth';

/**
 * @returns a button that allows users to sign in with Azure
 */
export const AzureSignin: React.FC = () => {
  const { azureLogin } = useAuth();

  return (
    <Button color="#FFF" background="#2596be" onClick={azureLogin}>
      Sign in with Azure
    </Button>
  );
};
