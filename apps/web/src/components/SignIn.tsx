import React, { useState } from 'react';
import { Button, Input } from '@chakra-ui/react';
import { useAuth } from '@web/hooks/useAuth.ts';
import { toaster, Toaster } from './ui/toaster';

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
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const loginResult = await login(loginForm.email, loginForm.password);
    setLoading(false);
    return loginResult;
  };

  return (
    <>
      <Toaster />
      <Input
        placeholder="Email"
        marginBottom="20px"
        padding="10px"
        value={loginForm.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setLoginForm({ ...loginForm, email: e.target.value })
        }
      />
      <Input
        type="password"
        placeholder="Password"
        marginBottom="20px"
        padding="10px"
        value={loginForm.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setLoginForm({ ...loginForm, password: e.target.value })
        }
      />
      <Button
        background="#4C658A"
        color="#FFF"
        marginBottom="20px"
        onClick={async () => {
          try {
            if (!(await handleLogin())) {
              toaster.create({
                title: 'Failed to log in',
                description:
                  'User not registered. Please ask an admin to register you.',
                type: 'error',
                duration: 3000,
              });
            }
          } catch (e) {
            toaster.create({
              title: 'Failed to log in',
              description: 'Please try again.',
              type: 'error',
              duration: 3000,
            });
          }
        }}
        loading={loading}
        disabled={loading}
      >
        Sign in
      </Button>
    </>
  );
};
