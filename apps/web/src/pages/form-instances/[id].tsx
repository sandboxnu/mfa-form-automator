import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import FormInstance from '@web/components/FormInstance';
import FormLoading from './../../components/FormLoading';
import ErrorComponent from './../../components/Error';
import { formInstancesControllerFindOne } from '@web/client';

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
          const result = await formInstancesControllerFindOne({
            path: { id: String(router.query.id) },
          });
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
      {formInstance?.data && !formInstanceError ? (
        <FormInstance formInstance={formInstance.data} />
      ) : (
        <ErrorComponent />
      )}
    </>
  );
}
