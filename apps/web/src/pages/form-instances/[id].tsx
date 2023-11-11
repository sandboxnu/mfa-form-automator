import { FormInstancesService } from '../../client/services/FormInstancesService';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

export default function FormInstanceView() {
  const router = useRouter();

  const {
    data: formInstance,
    error: formInstanceError,
    isLoading,
  } = useQuery(['formInstance', router.query.id], async () => {
    try {
      if (router.query.id) {
        const result =
          await FormInstancesService.formInstancesControllerFindOne(
            String(router.query.id),
          );
        return result;
      }
    } catch (error) {
      throw new Error(`Error fetching form instance data: ${error}`);
    }
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (formInstanceError) {
    return <p>Error loading form instance data</p>;
  }

  return formInstance;
}
