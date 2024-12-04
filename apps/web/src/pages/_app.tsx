import '../styles/globals.css';
import '@fontsource/hanken-grotesk';
import '@fontsource/hanken-grotesk/800.css';
import '@fontsource/hanken-grotesk/700.css';
import '@fontsource/hanken-grotesk/400.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { Layout } from 'apps/web/src/components/Layout';
import theme from '../styles/theme';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider } from './../context/AuthContext';
import { CreateFormTemplateProvider } from '@web/context/CreateFormTemplateContext';
import { OpenAPI } from '@web/client';
import Head from 'next/head';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '@web/authConfig';
import { MsalProvider } from '@azure/msal-react';
import { ReactNode, useMemo, memo } from 'react';

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
            <ChakraProvider theme={theme}>{children}</ChakraProvider>
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
  OpenAPI.CREDENTIALS = 'include';
  OpenAPI.WITH_CREDENTIALS = true;

  const excludeLayoutPaths = [
    '/signin',
    '/register',
    '/create-template/success',
  ];
  const createFormTemplatePath = '/create-template';

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
