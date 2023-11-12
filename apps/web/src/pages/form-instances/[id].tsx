import { FormInstancesService } from '../../client/services/FormInstancesService';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import FormInstance from '@web/components/FormInstance';

export default function FormInstanceView() {
  const router = useRouter();

  const {
    data: formInstance,
    error: formInstanceError,
    isLoading,
  } = useQuery({
    queryKey: ['formInstance', router.query.id],
    queryFn: async () => {
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
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      {formInstance && !formInstanceError ? (
        <FormInstance formInstance={formInstance} />
      ) : (
        <p>Error loading form instance data</p>
      )}
    </>
  );
}
