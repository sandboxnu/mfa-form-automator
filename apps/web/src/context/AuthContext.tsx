import React, { createContext, useEffect, useMemo, useState } from 'react';
import { User, jwtPayload, AuthContextType } from './types';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@web/authConfig';
import { callMsGraph } from '@web/graph';
import { useMutation } from '@tanstack/react-query';
import { EmployeeScope } from '@prisma/client';

import {
  appControllerLogin,
  appControllerLogout,
  appControllerRefresh,
  appControllerRegister,
  employeesControllerFindMe,
  JwtEntity,
  positionsControllerFindOne,
  RegisterEmployeeDto,
} from '../client';
import { client } from '@web/client/client.gen';
import { appControllerRegisterMutation } from '@web/client/@tanstack/react-query.gen';
// Reference: https://blog.finiam.com/blog/predictable-react-authentication-with-the-context-api

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export const AuthProvider = ({ children }: any) => {
  const router = useRouter();
  const { instance } = useMsal();
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>(undefined);

  const registerEmployeeMutation = useMutation({
    ...appControllerRegisterMutation(),
  });

  const requestProfileDataMutation = useMutation({
    mutationFn: async () => {
      return requestProfileData();
    },
    onSuccess: (data) => {
      setUserData(data);
    },
  });

  const parseUser = async (jwt?: JwtEntity) => {
    if (jwt) {
      const token = jwt.accessToken;
      const decoded = jwtDecode(token) as jwtPayload;

      const user: User = {
        id: decoded.sub,
        positionId: decoded.positionId,
        departmentId: decoded.departmentId,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        scope: decoded.scope,
      };

      setUser(user);
    } else {
      logout();
    }
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
    employeesControllerFindMe({ client: client })
      .then(async (employee) => {
        if (employee.data == null) {
          throw new Error('No employee data found');
        }
        // temporary fix for the user object
        const position = await positionsControllerFindOne({
          client: client,
          path: {
            id: employee.data.position.id,
          },
        });
        if (position.data == null) {
          throw new Error('No position data found');
        }

        setUser({
          id: employee.id,
          positionId: employee.position.id,
          departmentId: position.department.id,
          email: employee.email,
          firstName: employee.firstName,
          lastName: employee.lastName,
          scope: EmployeeScope.BASE_USER,
        });
      })
      .catch(async (_error) => {
        setUser(undefined);
        appControllerRefresh()
          .then((response) => {
            parseUser(response.data);
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

    appControllerLogin({
      client: client,
      body: {
        username: email,
        password: password,
      },
    })
      .then((response) => {
        if (response.data == null) {
          throw new Error('No JWT data found');
        }
        parseUser(response.data);
        router.push('/');
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

  const azureLogin = () => {
    instance
      .loginPopup(loginRequest)
      .then((response) => {
        login(response.account.username, 'password');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Request the profile data from the Microsoft Graph API
  const requestProfileData = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: instance.getAllAccounts()[0],
      });
      const profileData = await callMsGraph(response.accessToken);
      return profileData;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      throw error; // Optional: rethrow if you want to handle this upstream
    }
  };

  // Direct registering a user in the database to either fill positon + department
  // fields, or proceed to completeRegistration
  const register = async (email: string, password: string) => {
    const userData = await requestProfileDataMutation.mutateAsync();

    // check if either department or position is null, if so, push to register
    if (userData.department == null || userData.position == null) {
      userData.email = email;
      userData.password = password;
    }
    router.push('/register');
  };

  // Register a user with provided information to the database
  const completeRegistration = (
    email: string,
    password: string,
    position: string,
    department: string,
    signatureLink: string,
    scope: RegisterEmployeeDto.scope,
  ) => {
    const employee: RegisterEmployeeDto = {
      email: email,
      password: password,
      firstName: userData.givenName || userData.displayName.split(' ')[0],
      lastName: userData.surname || userData.displayName.split(' ')[1],
      departmentName: department,
      positionName: position,
      signatureLink: signatureLink,
      scope: scope,
    };

    registerEmployeeMutation.mutate(
      { body: employee },
      {
        onSuccess: () => {
          login(email, password);
        },
        onError: (error) => {
          setError(error);
        },
      },
    );
  };

  // Call the logout endpoint and then remove the user
  // from the state.
  const logout = () => {
    appControllerLogout().then(() => setUser(undefined));
    // Don't redirect if we are already on the signin page since it will cause a loop
    if (router.pathname !== '/signin') {
      router.replace('/signin');
    }
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
      userData,
      login,
      azureLogin,
      completeRegistration,
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
