import { FormList } from 'apps/web/src/components/FormList';
import { useAuth } from './../hooks/useAuth';
import { useForm } from '@web/hooks/useForm';

export default function Todo() {
  useAuth();
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
