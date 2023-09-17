import '../styles/globals.css';
import '@fontsource/hanken-grotesk';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { Layout } from 'apps/web/src/components/Layout';
import theme from '../styles/theme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}
