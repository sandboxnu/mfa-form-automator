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
    credentials: 'include',
  });

  const excludeLayoutPaths = [
    '/signin',
    '/register',
    '/create-template/success',
    '/create-instance/success',
  ];
  const createFormTemplatePath = '/create-template';
  const createFormInstancePath = '/create-instance';

  const head = (
    <Head>
      <title>MFA Forms</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );

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
