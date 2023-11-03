import { useAuth } from './../hooks/useAuth';
import { FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { User } from './../utils/types';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import { DefaultService } from '@web/client';

export default function Signin() {
  const { user, login, logout } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  interface jwtPayload {
    email: string;
    firstName: string;
    lastName: string;
  }

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
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button onClick={handleLogin}>Sign In</Button>
    </>
  );
}
