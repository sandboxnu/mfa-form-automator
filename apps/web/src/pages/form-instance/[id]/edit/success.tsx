import { Scope } from '@web/client/types.gen';
import { SuccessPage } from '@web/components/createForm/SuccessPage';
import isAuth from '@web/components/isAuth';
import { useRouter } from 'next/router';

function Success() {
  const router = useRouter();

  return (
    <SuccessPage
      message={'Your form instance has been updated!'}
      linkText={'Edit Form'}
      linkAction={() => router.push('/form-instance/[id]/edit/description')}
    />
  );
}

export default isAuth(Success);
