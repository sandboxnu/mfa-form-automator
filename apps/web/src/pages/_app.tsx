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
import { UserFormsContextProvider } from '@web/context/UserFormsContext';
import { EditFormTemplateProvider } from '@web/context/EditFormTemplateContext';
import { EditFormInstanceProvider } from '@web/context/EditFormInstanceContext';

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

  const createFormTemplatePath = '/form-template/create';
  const createFormInstancePath = '/form-instance/create';
  const editInstanceRegExPath = /^\/form-instance\/[^\/]+\/edit\/[^\/]+\/?$/;
  const editTemplateRegExPath = /^\/form-template\/[^\/]+\/edit\/[^\/]+\/?$/;

  const signFormInstancePath = '/sign-form';
  const excludeLayoutPaths = [
    '/signin',
    '/register',
    '/form-template/create/success',
    '/sign-form/success',
  ];
  const excludeLayoutPathsRegex = [
    /^\/form-instance\/[^\/]+\/edit\/success/,
    /^\/form-template\/[^\/]+\/edit\/success/,
  ];
  // to allow form template context to be populated before moving into edit mode
  const templateDirectoryPath = '/template-directory';
  // to allow form instance context for accessing id of just created to move into edit mode
  const instanceCreateSuccessPath = '/form-instance/create/success';

  // Check if the current page is an error page
  const isErrorPage =
    Component.displayName === 'ErrorPage' ||
    appProps.router.pathname === '/_error';

  const createApp = () => {
    let root = <Component {...pageProps} />;

    // not every page needs layout
    // skip layout for error pages
    // skip layout for excludeLayoutPaths
    // skip layout for instanceCreateSuccessPath

    // provide create form instance context if needed
    if (appProps.router.pathname.includes(createFormInstancePath)) {
      root = <CreateFormInstanceProvider>{root}</CreateFormInstanceProvider>;
    }

    // provide edit form instance context if needed.
    // we need this when creating and editing form instances,
    // so ordering of these statements is critical
    if (
      appProps.router.pathname.includes(createFormInstancePath) ||
      editInstanceRegExPath.test(appProps.router.pathname)
    ) {
      root = <EditFormInstanceProvider>{root}</EditFormInstanceProvider>;
    }

    // provide sign form instance context if needed
    if (appProps.router.pathname.includes(signFormInstancePath)) {
      const { id } = appProps.router.query;
      root = (
        <SignFormInstanceContextProvider id={id as string}>
          {root}
        </SignFormInstanceContextProvider>
      );
    }

    // provide create form template context if needed
    if (appProps.router.pathname.includes(createFormTemplatePath)) {
      root = <CreateFormTemplateProvider>{root}</CreateFormTemplateProvider>;
    }

    // provide edit form template context if needed
    if (
      appProps.router.pathname.includes(templateDirectoryPath) ||
      editTemplateRegExPath.test(appProps.router.pathname)
    ) {
      root = <EditFormTemplateProvider>{root}</EditFormTemplateProvider>;
    }

    // provide user forms context if needed
    // used in index, pending, todo, completed pages
    if (
      ['/pending', '/todo', '/completed'].includes(appProps.router.pathname) ||
      appProps.router.pathname == '/'
    ) {
      root = <UserFormsContextProvider>{root}</UserFormsContextProvider>;
    }

    // not every page needs layout
    // skip layout for error pages
    // skip layout for excludeLayoutPaths
    // skip layout for instanceCreateSuccessPath
    // skip layout for edit template/instance success pages
    if (
      !isErrorPage &&
      !excludeLayoutPaths.includes(appProps.router.pathname) &&
      !appProps.router.pathname.includes(instanceCreateSuccessPath) &&
      !excludeLayoutPathsRegex.some((regex) =>
        regex.test(appProps.router.pathname),
      )
    ) {
      root = <Layout>{root}</Layout>;
    }

    // all pages need the wrapper component
    root = <WrapperComponent>{root}</WrapperComponent>;

    return root;
  };

  return createApp();
}
