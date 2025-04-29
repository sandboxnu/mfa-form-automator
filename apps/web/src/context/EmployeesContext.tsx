import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { employeesControllerFindAllOptions } from '@web/client/@tanstack/react-query.gen';
import { EmployeeBaseEntityResponse } from '@web/client';

interface EmployeesContextType {
  employees: EmployeeBaseEntityResponse[];
  isLoading: boolean;
  error: Error | null;
}

export const EmployeesContext = createContext<EmployeesContextType>(
  {} as EmployeesContextType,
);

export const EmployeesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    isLoading,
    error,
    data: employees = [],
  } = useQuery({
    ...employeesControllerFindAllOptions(),
  });

  return (
    <EmployeesContext.Provider
      value={{
        // TODO
        employees,
        isLoading,
        error,
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployeesContext = () => useContext(EmployeesContext);
