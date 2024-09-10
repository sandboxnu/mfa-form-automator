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
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';

export const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  ...appProps
}: AppProps) {
  OpenAPI.CREDENTIALS = 'include';
  OpenAPI.WITH_CREDENTIALS = true;

  const excludeLayoutPaths = ['/signin'];
  const authTestingPaths = ['/auth'];

  const headComponent = (
    <Head>
      <title>MFA Forms</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );

  if (authTestingPaths.includes(appProps.router.pathname)) {
    return (
      <>
        {headComponent}
        <SessionProvider session={session}>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
              <Component {...pageProps} />
            </ChakraProvider>
          </QueryClientProvider>
        </SessionProvider>
      </>
    );
  }

  if (excludeLayoutPaths.includes(appProps.router.pathname)) {
    return (
      <>
        {headComponent}
        <SessionProvider session={session}>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <ChakraProvider theme={theme}>
                <Component {...pageProps} />
              </ChakraProvider>
            </QueryClientProvider>
          </AuthProvider>
        </SessionProvider>
      </>
    );
  }

  return (
    <>
      {headComponent}
      <SessionProvider session={session}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ChakraProvider>
          </QueryClientProvider>
        </AuthProvider>
      </SessionProvider>
    </>
  );
}
