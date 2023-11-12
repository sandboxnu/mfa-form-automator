import { FormList } from 'apps/web/src/components/FormList';
import { todoForms } from 'apps/web/src/data/seedData';
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
      ></FormList>
    </>
  );
}
