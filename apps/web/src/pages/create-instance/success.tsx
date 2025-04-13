import { Scope } from '@web/client/types.gen';
import { SuccessPage } from '@web/components/createForm/SuccessPage';
import isAuth from '@web/components/isAuth';
import { useRouter } from 'next/router';

function Success() {
  const router = useRouter();

  return (
    <SuccessPage
      message={'Your form instance has been created!'}
      linkText={'Edit Form'}
      linkAction={() => router.push('/create-instance/description')}
    />
  );
}

export default isAuth(Success);
