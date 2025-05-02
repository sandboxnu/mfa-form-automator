import { SuccessPage } from '@web/components/createForm/SuccessPage';
import isAuth from '@web/components/isAuth';
import { useEditFormInstance } from '@web/context/EditFormInstanceContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function Success() {
  const { setFormInstanceUseId, formInstanceData } = useEditFormInstance();
  const router = useRouter();

  useEffect(() => {
    if (router.query.id && typeof router.query.id == 'string') {
      setFormInstanceUseId(router.query.id);
    }
  }, [router.query]);

  if (!formInstanceData) {
    return <></>;
  }

  return (
    <SuccessPage
      message={'Your form instance has been created!'}
      linkText={'Edit Form'}
      linkAction={() => {
        router.push(`/form-instance/${formInstanceData.id}/edit/description`);
      }}
    />
  );
}

export default isAuth(Success);
