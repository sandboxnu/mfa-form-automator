import { FormList } from 'apps/web/src/components/FormList';
import { useForm } from '@web/hooks/useForm';
import { FormListPageLayout } from '@web/components/FormListPageLayout';

export default function Todo() {
  const { todoForms } = useForm();

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
