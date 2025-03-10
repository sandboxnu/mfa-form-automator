import React, { useState } from 'react';
import { Button, Input } from '@chakra-ui/react';
import { useAuth } from '@web/hooks/useAuth.ts';

/**
 * @param loginForm a form that contains the user's email and password
 * @returns a button that allows users to sign in
 */
export const SignIn: React.FC = () => {
  const { login } = useAuth();
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  return (
    <>
      <Input
        placeholder="Email"
        marginBottom="20px"
        value={loginForm.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setLoginForm({ ...loginForm, email: e.target.value })
        }
      />
      <Input
        type="password"
        placeholder="Password"
        marginBottom="20px"
        value={loginForm.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
    </>
  );
};
