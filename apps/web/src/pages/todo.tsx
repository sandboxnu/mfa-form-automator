import { FormList } from 'apps/web/src/components/FormList';
import { useForm } from '@web/hooks/useForm';
import { FormListPageLayout } from '@web/components/FormListPageLayout';
import isAuth from '@web/components/isAuth';

function Todo() {
  const { todoForms } = useForm();

  return (
    <>
      <FormListPageLayout>
        <FormList
          title={'To-Do'}
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
