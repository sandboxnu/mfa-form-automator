import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import FormInstance from '@web/components/FormInstance';
import FormLoading from './../../components/FormLoading';
import ErrorComponent from './../../components/Error';
import { formInstancesControllerFindOneOptions } from '@web/client/@tanstack/react-query.gen';

/**
 * @returns a view of a form instance
 */
export default function FormInstanceView() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: formInstance,
    error: formInstanceError,
    isLoading,
  } = useQuery({
    ...formInstancesControllerFindOneOptions({
      path: {
        id: String(id),
      },
    }),
    enabled: !!id,
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
