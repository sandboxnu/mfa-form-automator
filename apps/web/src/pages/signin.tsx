import { useAuth } from './../hooks/useAuth';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import { User } from './../utils/types';
import api from './../lib/apiClient';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';

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
    api.post('/auth/login', {
      'username': email,
      'password': password
    })
    .then((response) => {
      const token = response.data.jwt.access_token;
      const decoded = jwtDecode(token) as jwtPayload;
      console.log(decoded);
      const user: User = {
        'email': decoded.email,
        'firstName': decoded.firstName,
        'lastName': decoded.lastName,
      }
      login(user);
      router.push('/');
    })
    .catch((error) => {
      console.log(error);
    });
  }


  return <>
    <FormControl>
      <FormLabel>Email</FormLabel>
      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
    </FormControl>
    <FormControl>
      <FormLabel>Password</FormLabel>
      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
    </FormControl>
    <Button onClick={handleLogin}>Sign In</Button>
  </>
}