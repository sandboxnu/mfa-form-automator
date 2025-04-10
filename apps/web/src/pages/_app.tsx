import '../styles/globals.css';
import '@fontsource/hanken-grotesk';
import '@fontsource/hanken-grotesk/800.css';
import '@fontsource/hanken-grotesk/700.css';
import '@fontsource/hanken-grotesk/400.css';
import type { AppProps } from 'next/app';
import { Provider } from '@web/components/ui/provider';
import { Layout } from 'apps/web/src/components/Layout';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider } from './../context/AuthContext';
import { CreateFormTemplateProvider } from '@web/context/CreateFormTemplateContext';
import Head from 'next/head';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '@web/authConfig';
import { MsalProvider } from '@azure/msal-react';
import { ReactNode, useMemo, memo } from 'react';
import { client } from '@web/client/client.gen';
import { CreateFormInstanceProvider } from '@web/context/CreateFormInstanceContext';
import { appControllerRefresh } from '@web/client';
import { SignFormInstanceContextProvider } from '@web/context/SignFormInstanceContext';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

client.instance.interceptors.response.use(
  (response) => response, // Directly return successful responses.
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      error.response.config.url !== '/api/auth/refresh'
    ) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
      try {
        // Make a request to your auth server to refresh the token.
        await appControllerRefresh();
        return client.instance(originalRequest); // Retry the original request with the new access token.
      } catch (refreshError) {
        // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // For all other errors, return the error as is.
  },
);

export const queryClient = new QueryClient();
const publicClientApplication = new PublicClientApplication(msalConfig);

// WrapperComponent is memoized because MsalProvider causes a re-render on every navigation
const WrapperComponent = memo(({ children }: { children: ReactNode }) => {
  const head = useMemo(
    () => (
      <Head>
        <title>MFA Forms</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
    ),
    [],
  );

  return (
    <>
      {head}
      <MsalProvider instance={publicClientApplication}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Provider>{children}</Provider>
          </AuthProvider>
        </QueryClientProvider>
      </MsalProvider>
    </>
  );
});

WrapperComponent.displayName = 'WrapperComponent';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  ...appProps
}: AppProps) {
  client.setConfig({
    withCredentials: true,
  });

  const excludeLayoutPaths = [
    '/signin',
    '/register',
    '/create-template/success',
    '/create-instance/success',
    '/sign-form/success',
  ];
  const createFormTemplatePath = '/create-template';
  const createFormInstancePath = '/create-instance';
  const signFormInstancePath = '/sign-form';

  // Check if the current page is an error page
  const isErrorPage =
    Component.displayName === 'ErrorPage' ||
    appProps.router.pathname === '/_error';

  // If it's an error page, render just the component without Layout
  if (isErrorPage) {
    return (
      <WrapperComponent>
        <Component {...pageProps} />
      </WrapperComponent>
    );
  }

  if (excludeLayoutPaths.includes(appProps.router.pathname)) {
    return (
      <>
        <WrapperComponent>
          <Component {...pageProps} />
        </WrapperComponent>
      </>
    );
  }

  if (appProps.router.pathname.includes(createFormTemplatePath)) {
    return (
      <>
        <WrapperComponent>
          <CreateFormTemplateProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </CreateFormTemplateProvider>
        </WrapperComponent>
      </>
    );
  }

  if (appProps.router.pathname.includes(createFormInstancePath)) {
    return (
      <>
        <WrapperComponent>
          <CreateFormInstanceProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </CreateFormInstanceProvider>
        </WrapperComponent>
      </>
    );
  }
  if (appProps.router.pathname.includes(signFormInstancePath)) {
    const { id } = appProps.router.query;
    return (
      <>
        <WrapperComponent>
          <SignFormInstanceContextProvider id={id as string}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SignFormInstanceContextProvider>
        </WrapperComponent>
      </>
    );
  }
  return (
    <>
      <WrapperComponent>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WrapperComponent>
    </>
  );
}
