import React, { createContext, useEffect, useMemo, useState } from 'react';
import { User, jwtPayload, AuthContextType } from './types';
import { useRouter } from 'next/router';
import { DefaultService, EmployeesService, JwtEntity } from '@web/client';
import { jwtDecode } from 'jwt-decode';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@web/authConfig';
import { callMsGraph } from '@web/graph';
import { useMutation } from '@tanstack/react-query';
import { RegisterEmployeeDto } from '@web/client';
// Reference: https://blog.finiam.com/blog/predictable-react-authentication-with-the-context-api

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export const AuthProvider = ({ children }: any) => {
  const router = useRouter();
  const { instance: msalInstance, accounts: msalAccounts } = useMsal();
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  const registerEmployeeMutation = useMutation({
    mutationFn: async (employee: RegisterEmployeeDto) => {
      return DefaultService.appControllerRegister(employee);
    },
  });

  const parseUser = (jwt: JwtEntity) => {
    const token = jwt.accessToken;
    const decoded = jwtDecode(token) as jwtPayload;

    const user: User = {
      id: decoded.sub,
      positionId: decoded.positionId,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      isAdmin: decoded.isAdmin,
    };
    setUser(user);
  };

  // Reset the error state if we change page
  useEffect(() => {
    if (error) setError(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  // Check if there is a currently active session
  // when the provider is mounted for the first time.
  //
  // If there is an error, it means there is no session.
  //
  // Finally, just signal the component that the initial load
  // is over.
  useEffect(() => {
    setLoadingInitial(true);
    EmployeesService.employeesControllerFindMe()
      .then((employee) => {
        setUser({
          id: employee.id,
          positionId: employee.position.id,
          email: employee.email,
          firstName: employee.firstName,
          lastName: employee.lastName,
          isAdmin: employee.isAdmin,
        });
      })
      .catch(async (_error) => {
        setUser(undefined);
        DefaultService.appControllerRefresh()
          .then((response) => {
            
            parseUser(response);
          })
          .catch((_error) => {
            logout();
          });
      })
      .finally(() => setLoadingInitial(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Flags the component loading state and posts the login
  // data to the server.
  //
  // An error means that the email/password combination is
  // not valid.
  //
  // Finally, just signal the component that loading the
  // loading state is over.
  const login = (email: string, password: string) => {
    setLoading(true);

    DefaultService.appControllerLogin({
      username: email,
      password: password,
    })
      .then((response) => {
        router.push('/register');
        parseUser(response);
      })
      .catch((error) => {
        setError(error);

        if (error.status === 401) {
          // handle password was incorrect
        }
        if (error.status === 500) {
          register(email, password);
        }
      })
      .finally(() => setLoading(false));
  };

  // Request the profile data from the Microsoft Graph API
  const requestProfileData = async () => {
    try {
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: msalAccounts[0],
      });
      const profileData = await callMsGraph(response.accessToken);
      return profileData;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      throw error; // Optional: rethrow if you want to handle this upstream
    }
  };

  // Register the user in the database
  const register = async (email: string, password: string) => {
    const userData = await requestProfileData();
    const departmentName = userData.department;
    const positionName = userData.jobTitle;

    router.push("/register");
  

    const employee: RegisterEmployeeDto = {
      email: email,
      password: password,
      firstName: userData.givenName || userData.displayName.split(' ')[0],
      lastName: userData.surname || userData.displayName.split(' ')[1],
      departmentName: departmentName,
      positionName: positionName,
    };

    registerEmployeeMutation.mutate(employee, {
      onSuccess: () => {
        login(email, password);
      },
      onError: (error) => {
        setError(error);
      },
    });
  };

  // Call the logout endpoint and then remove the user
  // from the state.
  const logout = () => {
    DefaultService.appControllerLogout().then(() => setUser(undefined));
    // Don't redirect if we are already on the signin page since it will cause a loop
    if (router.pathname !== '/signin') router.push('/signin');
  };

  // Make the provider update only when it should.
  // We only want to force re-renders if the user,
  // loading or error states change.
  //
  // Whenever the `value` passed into a provider changes,
  // the whole tree under the provider re-renders, and
  // that can be very costly! Even in this case, where
  // you only get re-renders when logging in and out
  // we want to keep things very performant.
  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading, error],
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};
