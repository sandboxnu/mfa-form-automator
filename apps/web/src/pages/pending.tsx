import { FormList } from 'apps/web/src/components/FormList';
import { useForm } from '@web/hooks/useForm';
import { FormListPageLayout } from '@web/components/FormListPageLayout';
import isAuth from '@web/components/isAuth';

function Pending() {
  const { pendingForms } = useForm();

  return (
    <>
      <FormListPageLayout>
        <FormList
          title={'Pending'}
          formInstances={pendingForms}
          color={'#FFF0CC'}
          isDashboard={false}
        />
      </FormListPageLayout>
    </>
  );
}

export default isAuth(Pending);
