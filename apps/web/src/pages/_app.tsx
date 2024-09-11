import '../styles/globals.css';
import '@fontsource/hanken-grotesk';
import '@fontsource/hanken-grotesk/800.css';
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

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <>
        <Head>
          <title>MFA Forms</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
        </Head>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>{children}</ChakraProvider>
          </QueryClientProvider>
        </AuthProvider>
      </>
    );
  };

  if (excludeLayoutPaths.includes(appProps.router.pathname)) {
    return (
      <Wrapper>
        <Component {...pageProps} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Wrapper>
  );
}
