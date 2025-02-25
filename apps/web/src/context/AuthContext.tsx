import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User, jwtPayload, AuthContextType } from './types';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@web/authConfig';
import { callMsGraph, GraphUser } from '@web/graph';
import { useMutation } from '@tanstack/react-query';
import { Scope } from '@web/client';

import {
  appControllerLogin,
  appControllerLogout,
  employeesControllerFindMe,
  JwtEntity,
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
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [userData, setUserData] = useState<GraphUser>();

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

  // Call the logout endpoint and then remove the user
  // from the state.
  const logout = useCallback(async () => {
    await appControllerLogout()
      .then(() => setUser(undefined))
      .then(() => {
        // Don't redirect if we are already on the signin page since it will cause a loop
        if (router.pathname !== '/signin') {
          router.push('/signin');
        }
      });
  }, [router]);

  const parseUser = useCallback(
    (jwt?: JwtEntity) => {
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
    },
    [logout],
  );

  const fetchCurrentUser = async () => {
    let newUser: User | undefined = undefined;
    let employee = await employeesControllerFindMe({ client: client });
    if (employee.data) {
      newUser = {
        id: employee.data.id,
        positionId: employee.data.position.id,
        departmentId: employee.data.position.departmentId,
        email: employee.data.email,
        firstName: employee.data.firstName,
        lastName: employee.data.lastName,
        scope: employee.data.scope as Scope,
      };
      setUser(newUser);
    }
  };

  useEffect(() => {
    setLoadingInitial(true);
    fetchCurrentUser().then(() => setLoadingInitial(false));
  }, []);

  // Flags the component loading state and posts the login
  // data to the server.
  //
  // An error means that the email/password combination is
  // not valid.
  //
  // Finally, just signal the component that loading the
  // loading state is over.
  const login = useCallback(
    (email: string, password: string) => {
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
          if (error.status === 401) {
            // TODO: handle password was incorrect
          }

          if (error.status === 500) {
            // TODO: Why do we want to register if the error status is 500?
            // register(email, password);
          }
        });
    },
    [parseUser, router],
  );

  const azureLogin = useCallback(() => {
    instance
      .loginPopup(loginRequest)
      .then((response) => {
        // TODO: why are we using a constant value?
        login(response.account.username, 'password');
      })
      .catch((error) => {
        // TODO: Should we have better error handling here?
        console.error(error);
      });
  }, [instance, login]);

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

  // Register a user with provided information to the database
  const completeRegistration = useCallback(
    async (
      email: string,
      password: string,
      position: string,
      department: string,
      signatureLink: string,
      scope: RegisterEmployeeDto['scope'],
    ) => {
      if (!userData) {
        throw new Error('User data not found');
      }
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
      try {
        await registerEmployeeMutation.mutateAsync({
          body: employee,
        });
        login(email, password);
      } catch (e) {
        return e as Error;
      }
    },
    [login, registerEmployeeMutation, userData],
  );

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
      userData,
      login,
      azureLogin,
      completeRegistration,
      logout,
    }),
    [user, userData, login, azureLogin, completeRegistration, logout],
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};
