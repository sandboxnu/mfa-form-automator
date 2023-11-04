import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { EmployeesService } from './../client/index';

export const useAuth = () => {
  const { user, login, logout, isLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  const { isLoading, data, error } = useQuery({
    queryKey: ['employees/find/me'],
    queryFn: EmployeesService.employeesControllerFindMe,
  })

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }

    if (error) {
      router.push('/signin');
      return;
    }

    if (!user && !isLoading) {
      if (data) {
        const { firstName, lastName, email } = data;
        login({ firstName, lastName, email });
      } else {
        router.push('/signin');
        return;
      }
    }
  }, [user, router, data, isLoading, error, login, isLoggedIn])

  return { user, login, logout };
};
