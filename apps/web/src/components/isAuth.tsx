import { useLayoutEffect } from 'react';
import { useAuth } from '@web/hooks/useAuth';
import { useRouter } from 'next/router';
import { Scope } from '@web/client';
import { ErrorIcon } from '@web/static/icons';

export default function isAuth(Component: any, scope?: Scope) {
  return function IsAuth(props: any) {
    const router = useRouter();
    const { user } = useAuth();

    useLayoutEffect(() => {
      if (!user) {
        router.push('/signin');
      }
    }, [user, router]);

    if (!user || (scope && user?.scope !== scope)) {
      return (
        <div style={{ textAlign: 'center', paddingTop: '144px' }}>
          <ErrorIcon width="44px" height="44px" />
          <div>
            <p
              style={{ paddingTop: '20px', fontSize: '24px', fontWeight: 500 }}
            >
              Unauthorized.
            </p>
            <p style={{ paddingTop: '3px', fontSize: '18px', fontWeight: 400 }}>
              You do not have access to this page.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
