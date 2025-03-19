import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import FormInstance from '@web/components/FormInstance';
import FormLoading from './../../components/FormLoading';
import ErrorComponent from './../../components/Error';
import { formInstancesControllerFindOneOptions } from '@web/client/@tanstack/react-query.gen';
import isAuth from '@web/components/isAuth';
import { Scope } from '@web/client';

/**
 * @returns a view of a form instance
 */
function FormInstanceView() {
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
// TODO: This should be restricted
export default isAuth(FormInstanceView, []);
