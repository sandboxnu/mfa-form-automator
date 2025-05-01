import { SuccessPage } from '@web/components/createForm/SuccessPage';
import isAuth from '@web/components/isAuth';
import { useEditFormInstance } from '@web/context/EditFormInstanceContext';
import { useAuth } from '@web/hooks/useAuth';
import { useRouter } from 'next/router';
import EditGuard from './EditGuard';

function Success() {
  const router = useRouter();
  const { formInstanceUseId, formInstanceData } = useEditFormInstance();
  const { user } = useAuth();

  // prefills the form instance edit context with the necessary fields and reroutes to edit description
  const populateAndReroute = () => {
    // this screen appears after an iteration of editing, therefore edit context fields are populated with previous values
    router.push('/form-instance/' + formInstanceUseId + '/edit/description');
  };

  if (!user || !formInstanceData) {
    return <></>;
  }

  return (
    <EditGuard formInstanceData={formInstanceData} user={user}>
      <SuccessPage
        message={'Your form instance has been updated!'}
        linkText={'Edit Form'}
        linkAction={populateAndReroute}
      />
    </EditGuard>
  );
}

export default isAuth(Success);
