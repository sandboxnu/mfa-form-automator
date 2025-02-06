import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import FormInstance from '@web/components/FormInstance';
import FormLoading from './../../components/FormLoading';
import ErrorComponent from './../../components/Error';
import { formInstancesControllerFindOne } from '@web/client';
import { formInstancesControllerFindOneOptions } from '@web/client/@tanstack/react-query.gen';

/**
 * @returns a view of a form instance
 */
export default function FormInstanceView() {
  const router = useRouter();

  if (!router.query.id) {
    return <ErrorComponent />;
  }

  const {
    data: formInstance,
    error: formInstanceError,
    isLoading,
  } = useQuery({
    ...formInstancesControllerFindOneOptions({
      path: {
        id: String(router.query.id),
      },
    }),
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
