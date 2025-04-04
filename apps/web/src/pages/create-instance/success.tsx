import { Scope } from '@web/client/types.gen';
import { SuccessPage } from '@web/components/createForm/SuccessPage';
import isAuth from '@web/components/isAuth';
import { useRouter } from 'next/router';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';

function Success() {
  const router = useRouter();
  const {
    assignedGroupData,
    setAssignedGroupData,
    formInstanceName,
    setFormInstanceName,
    formInstanceDescription,
    setFormInstanceDescription,
    formTemplate,
    setFormTemplate,
    useId,
    setUseId,
  } = useCreateFormInstance();

  function navigateToFormInstance() {}

  return (
    <SuccessPage
      message={'Your form instance has been created!'}
      linkText={'Edit Form'}
      linkAction={navigateToFormInstance}
    />
  );
}

export default isAuth(Success);
