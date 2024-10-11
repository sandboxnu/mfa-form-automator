import React, { createContext, useEffect, useMemo, useState } from 'react';
import { User, jwtPayload, AuthContextType } from './types';
import { useRouter } from 'next/router';
import { DefaultService, EmployeesService, JwtEntity } from '@web/client';
import { jwtDecode } from 'jwt-decode';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@web/authConfig';
import { callMsGraph } from '@web/graph';

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

  // Request the profile data from the Microsoft Graph API
  const requestProfileData = () => {
    msalInstance
      .acquireTokenSilent({
        ...loginRequest,
        account: msalAccounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken).then((response) => {
          // register or update the user in the database
          console.log(response);
        });
      });
  };

  // Parse the user from the JWT and request the profile data
  const handlePostLogin = (jwt: JwtEntity) => {
    parseUser(jwt);
    requestProfileData();
  };

  // Reset the error state if we change page
  useEffect(() => {
    if (error) setError(undefined);
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
            handlePostLogin(response);
          })
          .catch((_error) => {
            logout();
          });
      })
      .finally(() => setLoadingInitial(false));
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
        handlePostLogin(response);
        router.push('/');
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
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
    [user, loading, error],
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};
