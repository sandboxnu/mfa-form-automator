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

  const excludeLayoutPaths = ['/signin', '/register'];

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
