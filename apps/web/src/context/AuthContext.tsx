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
import { appControllerRegister, OnboardEmployeeDto, Scope } from '@web/client';

import {
  appControllerLogin,
  appControllerLogout,
  employeesControllerFindMe,
  JwtEntity,
} from '../client';
import { client } from '@web/client/client.gen';
import { employeesControllerOnboardEmployeeMutation } from '@web/client/@tanstack/react-query.gen';
// Reference: https://blog.finiam.com/blog/predictable-react-authentication-with-the-context-api

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export const AuthProvider = ({ children }: any) => {
  const router = useRouter();
  const { instance } = useMsal();
  const [user, setUser] = useState<User>();
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [azureUser, setAzureUser] = useState<GraphUser>();

  const onboardEmployeeMutation = useMutation({
    ...employeesControllerOnboardEmployeeMutation(),
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
    async (jwt?: JwtEntity) => {
      if (jwt) {
        const token = jwt.accessToken;
        const decoded = jwtDecode(token) as jwtPayload;
        const signatureLink = (await fetchCurrentUser())?.signatureLink;

        const user: User = {
          id: decoded.sub,
          positionId: decoded.positionId,
          departmentId: decoded.departmentId,
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          scope: decoded.scope,
          signatureLink: signatureLink ?? '',
          position: decoded.position,
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
        positionId: employee.data.position?.id ?? null,
        departmentId: employee.data.position?.department?.id ?? null,
        email: employee.data.email,
        firstName: employee.data.firstName,
        lastName: employee.data.lastName,
        scope: employee.data.scope as Scope,
        signatureLink: employee.data.signatureLink ?? '',
        position: employee.data.position,
      };
      return newUser;
    }
  };

  useEffect(() => {
    setLoadingInitial(true);
    fetchCurrentUser()
      .then((fetchedUser) => setUser(fetchedUser))
      .finally(() => setLoadingInitial(false));
  }, []);

  useEffect(() => {
    if (
      !router.pathname.includes('register') &&
      !loadingInitial &&
      user &&
      user.position?.id === null
    ) {
      router.push('/register');
    }
  }, [loadingInitial, router, user]);

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
      return appControllerLogin({
        client: client,
        body: {
          username: email,
          password: password,
        },
      })
        .then(async (response) => {
          if (response.data == null) {
            return false;
          }
          await parseUser(response.data);
          router.push('/');
          return true;
        })
        .catch((e) => {
          throw e;
        });
    },
    [parseUser, router],
  );

  const azureLogin = useCallback(async () => {
    // Get the access token for the Microsoft Graph API
    const getAccessToken = async () => {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: instance.getAllAccounts()[0],
      });
      return response.accessToken;
    };

    // Request the profile data from the Microsoft Graph API
    const requestProfileData = async (accessToken: string) => {
      try {
        const profileData = await callMsGraph(accessToken);
        return profileData;
      } catch (error) {
        console.error('Error fetching profile data:', error);
        throw error;
      }
    };

    await instance.loginPopup(loginRequest);

    const accessToken = await getAccessToken();
    const graphUser = await requestProfileData(accessToken);

    if (!graphUser) {
      throw new Error('Azure user data not found');
    }

    setAzureUser(graphUser);

    if (!(await login(graphUser?.mail, graphUser?.id))) {
      if (!graphUser) {
        throw new Error('Azure user data not found');
      }
      await appControllerRegister({
        body: {
          firstName: graphUser.givenName ?? graphUser.displayName.split(' ')[0],
          lastName: graphUser.surname ?? graphUser.displayName.split(' ')[1],
          email: graphUser.mail,
          password: graphUser.id,
          accessToken: accessToken,
        },
      });
      await login(graphUser.mail, graphUser.id);
    }
  }, [instance, login]);

  // Register a user with provided information to the database
  const completeRegistration = useCallback(
    async (positionId: string, signatureLink: string) => {
      const onboardingEmployeeDto: OnboardEmployeeDto = {
        positionId: positionId,
        signatureLink: signatureLink,
      };
      await onboardEmployeeMutation.mutateAsync({
        body: onboardingEmployeeDto,
      });
      const user = await fetchCurrentUser();
      setUser(user);
      router.push('/');
    },
    [onboardEmployeeMutation, router],
  );

  const refreshUser = useCallback(async () => {
    try {
      const userData = await fetchCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, []);

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
      azureUser,
      login,
      azureLogin,
      completeRegistration,
      logout,
      refreshUser,
    }),
    [
      user,
      azureUser,
      login,
      azureLogin,
      completeRegistration,
      logout,
      refreshUser,
    ],
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};
