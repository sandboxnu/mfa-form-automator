import { FormList } from 'apps/web/src/components/FormList';
import { FormListPageLayout } from '@web/components/FormListPageLayout';
import isAuth from '@web/components/isAuth';
import { useUserFormsContext } from '@web/context/UserFormsContext';

function Todo() {
  const { todoForms } = useUserFormsContext();

  return (
    <>
      <FormListPageLayout>
        <FormList
          title={'Todo'}
          formInstances={todoForms}
          color={'#FFDFDE'}
          isDashboard={false}
          link={'/'}
        />
      </FormListPageLayout>
    </>
  );
}

export default isAuth(Todo);
