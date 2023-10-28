import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

export const useAuth = () => {
  const {user, login, logout} = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user && router.pathname != 'signin' && router.isReady) {
      router.push('/signin');
    }
  }, [user, router])

  return {user, login, logout};
};