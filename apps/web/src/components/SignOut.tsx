import React from 'react';
import { SignoutIcon } from '@web/static/icons';
import { Flex, Text } from '@chakra-ui/react';
import { useAuth } from '@web/hooks/useAuth';

export const SignOut: React.FC = () => {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>
      <Flex align="center">
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
        <SignoutIcon />
      </Flex>
    </button>
  );
};
