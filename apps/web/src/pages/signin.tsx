import { Button, Box, Input } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import { MFALogoIcon } from '@web/static/icons';
import { useAuth } from '@web/hooks/useAuth';
import { useState } from 'react';
import { AzureSignin } from '@web/components/AzureSignin';

export default function Signin() {
  const { login } = useAuth();
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  return (
    <>
      <Flex
        justifyContent={'center'}
        marginTop={'168px'}
        marginBottom={'100px'}
      >
        <Box
          width="480px"
          borderRadius="8px"
          background="#FFF"
          boxShadow="0px 0px 6px 1px #D4D4D4"
          padding="48px"
        >
          <Flex justifyContent={'center'}>
            <MFALogoIcon width="150px" height="30px" marginBottom="20px" />
          </Flex>
          <Flex
            justifyContent="center"
            marginTop="32px"
            flexDirection={'column'}
          >
            <Input
              placeholder="Email"
              marginBottom="20px"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
            />
            <Input
              type="password"
              placeholder="Password"
              marginBottom="20px"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />
            <Button
              background="#4C658A"
              color="#FFF"
              marginBottom="20px"
              onClick={() => login(loginForm.email, loginForm.password)}
            >
              Sign in
            </Button>
            <AzureSignin />
          </Flex>
        </Box>
      </Flex>
    </>
  );
}
