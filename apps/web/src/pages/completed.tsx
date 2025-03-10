import { FormList } from 'apps/web/src/components/FormList';
import { useForm } from '@web/hooks/useForm';
import { FormListPageLayout } from '@web/components/FormListPageLayout';
import isAuth from '@web/components/isAuth';

function Completed() {
  const { completedForms } = useForm();

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
