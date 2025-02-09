import React from 'react';
import { Button } from '@chakra-ui/react';
import { useAuth } from '@web/hooks/useAuth.ts';

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
