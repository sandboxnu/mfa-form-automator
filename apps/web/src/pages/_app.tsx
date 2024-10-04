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
import { ReactNode } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from '@web/authConfig';

export const queryClient = new QueryClient();
const publicClientApplication = new PublicClientApplication(msalConfig);

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  ...appProps
}: AppProps) {
  OpenAPI.CREDENTIALS = 'include';
  OpenAPI.WITH_CREDENTIALS = true;

  const excludeLayoutPaths = ['/signin'];

  const head = (
    <Head>
      <title>MFA Forms</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );

  const WrapperComponent = ({ children }: { children: ReactNode }) => {
    return (
      <>
        {head}
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
              <MsalProvider instance={publicClientApplication}>
                {children}
              </MsalProvider>
            </ChakraProvider>
          </QueryClientProvider>
        </AuthProvider>
      </>
    );
  };

  if (excludeLayoutPaths.includes(appProps.router.pathname)) {
    return (
      <WrapperComponent>
        <Component {...pageProps} />
      </WrapperComponent>
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
