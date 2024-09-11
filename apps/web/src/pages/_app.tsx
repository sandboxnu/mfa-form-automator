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

export const queryClient = new QueryClient();

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

  if (excludeLayoutPaths.includes(appProps.router.pathname)) {
    return (
      <>
        {head}
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
              <Component {...pageProps} />
            </ChakraProvider>
          </QueryClientProvider>
        </AuthProvider>
      </>
    );
  }

  return (
    <>
      {head}
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ChakraProvider>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}
