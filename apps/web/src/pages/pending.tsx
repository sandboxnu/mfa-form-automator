import { FormList } from 'apps/web/src/components/FormList';
import { FormListPageLayout } from '@web/components/FormListPageLayout';
import isAuth from '@web/components/isAuth';
import { useUserFormsContext } from '@web/context/UserFormsContext';

function Pending() {
  const { pendingForms } = useUserFormsContext();

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
