import { Scope } from '@web/client';
import { SuccessPage } from '@web/components/createForm/SuccessPage';
import isAuth from '@web/components/isAuth';
import { useRouter } from 'next/router';

function Success() {
  const router = useRouter();

  return (
    <SuccessPage
      message={'Your form has been signed!'}
      linkText={'Go to dashboard'}
      linkAction={() => router.push('/')}
    />
  );
}

export default isAuth(Success, [Scope.ADMIN]);
