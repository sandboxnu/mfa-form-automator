import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { employeesControllerFindAllOptions } from '@web/client/@tanstack/react-query.gen';
import { EmployeesContextType } from './types';

export const EmployeesContext = createContext<EmployeesContextType>(
  {} as EmployeesContextType,
);

export const EmployeesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isLoading, error, data } = useQuery({
    ...employeesControllerFindAllOptions({
      query: {
        secure: true,
      },
    }),
  });

  return (
    <EmployeesContext.Provider
      value={{
        employees: data?.employees ?? [],
        isLoading,
        error,
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployeesContext = () => useContext(EmployeesContext);
