import { SuccessPage } from '@web/components/createForm/SuccessPage';
import isAuth from '@web/components/isAuth';
import { useEditFormInstance } from '@web/context/EditFormInstanceContext';
import { useRouter } from 'next/router';

function Success() {
  const router = useRouter();
  const { formInstanceUseId } = useEditFormInstance();

  // prefills the form instance edit context with the necessary fields and reroutes to edit description
  const populateAndReroute = () => {
    // this screen appears after an iteration of editing, therefore edit context fields are populated with previous values
    router.push('/form-instance/' + formInstanceUseId + '/edit/description');
  };

  return (
    <SuccessPage
      message={'Your form instance has been updated!'}
      linkText={'Edit Form'}
      linkAction={populateAndReroute}
    />
  );
}

export default isAuth(Success);
