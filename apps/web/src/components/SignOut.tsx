import React from 'react';
import { SignoutIcon } from '@web/static/icons.tsx';
import { Button, Flex, Text } from '@chakra-ui/react';
import { useAuth } from '@web/hooks/useAuth.ts';

export const SignOut: React.FC = () => {
  const { logout } = useAuth();

  return (
    <Button background="white" onClick={logout} cursor="pointer">
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
