import '../styles/globals.css';
import '@fontsource/hanken-grotesk';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { Layout } from 'apps/web/src/components/Layout';
import theme from '../styles/theme';
import {
  QueryClientProvider,
  QueryClient,
} from '@tanstack/react-query'
import axios from 'axios'
import { AuthContext } from './../context/AuthContext';
import { useState } from 'react';
import { User } from '@web/utils/types';

export default function App({ Component, pageProps, ...appProps }: AppProps) {
  const baseUrl = 'http://localhost:' + process.env.PORT;
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: async ({ queryKey }) => {
          const { data } = await axios.get(`${baseUrl}/${queryKey[0]}`, queryKey[1] as any)
          return data
        },
      },
    },
  }) 

  const excludeLayoutPaths = ['/signin']
  const [user, setUser] = useState<User | null>(null)

  if (excludeLayoutPaths.includes(appProps.router.pathname)) {
    return (
      <AuthContext.Provider value={{ user, setUser }}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </QueryClientProvider>
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}
