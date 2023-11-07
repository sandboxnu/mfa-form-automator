import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { EmployeesService } from './../client/index';
import { useAuthData } from './useAuthData';

export const useAuth = () => {
  const { user, login, logout } = useAuthData();
  const router = useRouter();

  const { isLoading, data, error } = useQuery({
    queryKey: ['employees/me'],
    queryFn: EmployeesService.employeesControllerFindMe,
  });

  useEffect(() => {
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
  }, [user, router, data, isLoading, error, login]);

  return { user, login, logout };
};
