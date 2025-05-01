import { Scope } from '@web/client';
import { SuccessPage } from '@web/components/createForm/SuccessPage';
import isAuth from '@web/components/isAuth';
import { useRouter } from 'next/router';

function Success() {
  const router = useRouter();

  return (
    <SuccessPage
      message={'Your form template has been updated!'}
      linkText={'Create form instance'}
      linkAction={() => router.push('/form-instance/create/select-template')}
    />
  );
}

export default isAuth(Success, [Scope.ADMIN, Scope.CONTRIBUTOR]);
