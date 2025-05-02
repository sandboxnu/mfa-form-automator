import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useAuth } from '@web/hooks/useAuth.ts';
import { toaster, Toaster } from './ui/toaster';

/**
 * @returns a button that allows users to sign in with Azure
 */
export const AzureSignin: React.FC = () => {
  const { azureLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAzureLogin = async () => {
    setLoading(true);
    const loginResult = await azureLogin();
    setLoading(false);
    return loginResult;
  };

  return (
    <>
      <Toaster />

      <Button
        color="#FFF"
        background="#2596be"
        onClick={async () => {
          try {
            if (!(await handleAzureLogin())) {
              toaster.create({
                title: 'Failed to log in',
                description:
                  'Azure user not registered. Please ask an admin to register you.',
                type: 'error',
                duration: 3000,
              });
            }
          } catch (error) {
            toaster.create({
              title: 'Error',
              description: 'An error occurred during Azure login.',
              type: 'error',
              duration: 3000,
            });
          }
        }}
        loading={loading}
        disabled={loading}
      >
        Sign in with Azure
      </Button>
    </>
  );
};
