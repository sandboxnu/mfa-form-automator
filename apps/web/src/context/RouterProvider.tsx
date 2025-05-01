import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { RouterContextType } from './types';

const RouterContext = createContext<RouterContextType>({
  isRouteChanging: false,
});

export const RouterProvider = ({ children }: { children: any }) => {
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsRouteChanging(true);
    };

    const handleRouteChangeComplete = () => {
      setIsRouteChanging(false);
    };

    const handleRouteChangeError = () => {
      setIsRouteChanging(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);

  return (
    <RouterContext.Provider value={{ isRouteChanging }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouterContext = () => useContext(RouterContext);
