import { SuccessPage } from '@web/components/createForm/SuccessPage';
import isAuth from '@web/components/isAuth';
import { useRouter } from 'next/router';

function Success() {
  const router = useRouter();

  return (
    <SuccessPage
      message={'The form has been approved!'}
      linkText={'Go to completed'}
      linkAction={() => router.push('/completed')}
    />
  );
}

export default isAuth(Success);
