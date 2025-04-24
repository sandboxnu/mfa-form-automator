import { useQuery } from '@tanstack/react-query';
import {
  formInstancesControllerFindAll,
  formInstancesControllerFindOne,
} from '@web/client';
import { formInstancesControllerFindOneOptions } from '@web/client/@tanstack/react-query.gen';
import { SuccessPage } from '@web/components/createForm/SuccessPage';
import isAuth from '@web/components/isAuth';
import { useEditFormInstance } from '@web/context/EditFormInstanceContext';
import { useRouter } from 'next/router';

function Success() {
  const router = useRouter();
  const {
    setFormInstanceName,
    setFormInstanceDescription,
    setAssignedGroupData,
    formInstanceUseId,
  } = useEditFormInstance();
  const {
    data: formInstance,
    error: formInstanceError,
    isLoading,
  } = useQuery({
    ...formInstancesControllerFindOneOptions({
      path: {
        id: formInstanceUseId!!,
      },
    }),
    enabled: !!formInstanceUseId,
    retry: (failureCount, error) => {
      if (error.message === 'Request failed with status code 401') {
        return false; // Do not retry on 401 errors
      }
      return failureCount < 3; // Retry up to 3 times for other errors
    },
  });

  // prefills the form instance edit context with the necessary fields and reroutes to edit description
  const populateAndReroute = () => {
    if (formInstanceError || !formInstance) {
      return;
    }
    setFormInstanceName(formInstance.name);
    setFormInstanceDescription(formInstance.description);
  };

  return (
    <SuccessPage
      message={'Your form instance has been updated!'}
      linkText={'Edit Form'}
      linkAction={() =>
        router.push('/form-instance/' + formInstanceUseId + '/edit/description')
      }
    />
  );
}

export default isAuth(Success);
