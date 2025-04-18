import { Scope } from '@web/client/types.gen';
import { SuccessPage } from '@web/components/createForm/SuccessPage';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useRouter } from 'next/router';

function Success() {
  const router = useRouter();
  const { formInstanceUseId } = useCreateFormInstance();

  return (
    <SuccessPage
      message={
        formInstanceUseId
          ? 'Your form instance has been updated!'
          : 'Your form instance has been created!'
      }
      linkText={'Edit Form'}
      linkAction={() => router.push('/create-instance/description')}
    />
  );
}

export default isAuth(Success);
