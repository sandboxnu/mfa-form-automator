import { FormList } from 'apps/web/src/components/FormList';
import { useForm } from '@web/hooks/useForm';

export default function Todo() {
  const { todoForms } = useForm();

  return (
    <>
      <FormList
        title={'Todo'}
        formInstances={todoForms}
        color={'#FFDFDE'}
        isDashboard={false}
        link={'/'}
      ></FormList>
    </>
  );
}
