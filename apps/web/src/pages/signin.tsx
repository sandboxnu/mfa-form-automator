import { useAuthData } from './../hooks/useAuthData';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { useState } from 'react';
import { User, jwtPayload } from './../utils/types';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import { DefaultService } from '@web/client';
import { Flex } from '@chakra-ui/react';
import { MFALogoIcon } from '@web/static/icons';

export default function Signin() {
  const { login } = useAuthData();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = () => {
    DefaultService.appControllerLogin({
      username: email,
      password: password,
    })
      .then((response) => {
        const token = response.access_token;
        const decoded = jwtDecode(token) as jwtPayload;

        const user: User = {
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
        };
        login(user);
        router.push('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Flex
        justifyContent={'center'}
        marginTop={'168px'}
        marginBottom={'100px'}
      >
        <Box
          width="480px"
          height="392px"
          borderRadius="8px"
          background="#FFF"
          boxShadow="0px 0px 6px 1px #D4D4D4"
          padding="48px"
        >
          <Flex justifyContent={'center'}>
            <MFALogoIcon width="150px" height="30px" marginBottom="20px" />
          </Flex>
          <FormControl size="md">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl marginTop="22px" size="md">
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                pr="4.5rem"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClickShowPassword}>
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Flex justifyContent="center" marginTop="32px" marginBottom="48px">
            <Button background="#4C658A" color="#FFF" onClick={handleLogin}>
              Sign In
            </Button>
          </Flex>
        </Box>
      </Flex>
    </>
  );
}
