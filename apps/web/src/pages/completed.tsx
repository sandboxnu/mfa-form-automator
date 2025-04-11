import { FormList } from 'apps/web/src/components/FormList';
import { FormListPageLayout } from '@web/components/FormListPageLayout';
import isAuth from '@web/components/isAuth';
import { useUserFormsContext } from '@web/context/UserFormsContext';

function Completed() {
  const { completedForms } = useUserFormsContext();

  return (
    <>
      <FormListPageLayout>
        <FormList
          title={'Completed'}
          formInstances={completedForms}
          color={'#D0F0DC'}
          isDashboard={false}
        />
      </FormListPageLayout>
    </>
  );
}

export default isAuth(Completed);
