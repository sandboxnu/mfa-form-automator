import { Scope } from '@web/client/types.gen';
import { SuccessPage } from '@web/components/createForm/SuccessPage';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useRouter } from 'next/router';

function Success() {
  const router = useRouter();
  const { formInstanceUseId, setFormInstanceUseId } = useCreateFormInstance();
  // use id to indicate whether first creation or previous edit
  const create: Boolean = formInstanceUseId?.substring(0, 6) == 'create';

  // navigates to edit mode
  function submit() {
    // remove create prefix if present
    if (create && formInstanceUseId) {
      setFormInstanceUseId(formInstanceUseId.substring(6));
    }
    // navigate to edit mode
    router.push('/create-instance/description');
  }

  return (
    <SuccessPage
      message={
        create
          ? 'Your form instance has been created!'
          : 'Your form instance has been updated!'
      }
      linkText={'Edit Form'}
      linkAction={submit}
    />
  );
}

export default isAuth(Success);
