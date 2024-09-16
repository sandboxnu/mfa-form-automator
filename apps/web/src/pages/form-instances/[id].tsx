import { FormInstancesService } from '../../client/services/FormInstancesService';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import FormInstance from '@web/components/FormInstance';
import FormLoading from './../../components/FormLoading';
import ErrorComponent from './../../components/Error';

/**
 * @returns a view of a form instance
 */
export default function FormInstanceView() {
  const router = useRouter();

  const {
    data: formInstance,
    error: formInstanceError,
    isLoading,
  } = useQuery({
    queryKey: ['api', 'form-instances', router.query.id],
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
    return <FormLoading />;
  }
  return (
    <>
      {formInstance && !formInstanceError ? (
        <FormInstance formInstance={formInstance} />
      ) : (
        <ErrorComponent />
      )}
    </>
  );
}
